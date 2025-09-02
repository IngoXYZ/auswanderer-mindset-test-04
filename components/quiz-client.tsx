
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { questions, getResultType, getRecommendations } from '@/lib/questions';
import { saveQuizSession, getUserSession } from '@/lib/local-storage';
import { sendQuizResults } from '@/lib/emailjs-service';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export default function QuizClient() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);

  useEffect(() => {
    const session = getUserSession();
    if (!session) {
      router.push('/');
      return;
    }
    setUserSession(session);
  }, [router]);

  const handleAnswer = (questionId: string, score: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const canProceed = () => {
    return answers[questions[currentQuestion].id] !== undefined;
  };

  const calculateResults = () => {
    let totalScore = 0;
    const categoryScores: Record<string, number[]> = {
      adaptability: [],
      riskTolerance: [],
      financialSituation: [],
      valuesCompass: [],
      securityNeeds: []
    };

    // Calculate scores
    for (const [questionId, score] of Object.entries(answers)) {
      const question = questions.find(q => q.id === questionId);
      if (!question) continue;

      totalScore += score;
      categoryScores[question.category]?.push(score);
    }

    // Calculate averages
    const finalCategoryScores: Record<string, number> = {};
    Object.entries(categoryScores).forEach(([category, scores]) => {
      if (scores.length > 0) {
        finalCategoryScores[category] = scores.reduce((a, b) => a + b, 0) / scores.length;
      }
    });

    const resultType = getResultType(totalScore);
    const recommendations = getRecommendations(finalCategoryScores);

    return {
      totalScore,
      maxScore: questions.length * 5,
      resultType,
      categoryScores: finalCategoryScores,
      recommendations
    };
  };

  const handleSubmit = async () => {
    if (!userSession) return;

    setIsSubmitting(true);
    
    try {
      const results = calculateResults();
      
      // Save to localStorage
      saveQuizSession({
        userId: userSession.userId,
        answers,
        ...results
      });

      // Send email with results
      const emailSuccess = await sendQuizResults({
        name: userSession.name,
        email: userSession.email,
        totalScore: results.totalScore,
        maxScore: results.maxScore,
        resultType: results.resultType,
        categoryScores: results.categoryScores,
        recommendations: results.recommendations,
        timestamp: new Date().toLocaleDateString('de-DE') + ' ' + new Date().toLocaleTimeString('de-DE')
      });

      if (emailSuccess) {
        toast.success('Ergebnisse erfolgreich versendet!');
      } else {
        toast.error('E-Mail-Versand fehlgeschlagen, aber Ergebnisse gespeichert');
      }

      router.push('/results');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Fehler beim Speichern der Antworten');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userSession) {
    return <div>Lädt...</div>;
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Frage {currentQuestion + 1} von {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(progress)}% abgeschlossen
              </span>
            </div>
            <Progress value={progress} className="mb-6" />
            <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
              {question.text}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <RadioGroup
              value={answers[question.id]?.toString() || ""}
              onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
              className="space-y-4"
            >
              {[
                { value: 1, label: "Stimme überhaupt nicht zu" },
                { value: 2, label: "Stimme nicht zu" },
                { value: 3, label: "Neutral" },
                { value: 4, label: "Stimme zu" },
                { value: 5, label: "Stimme voll und ganz zu" }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem 
                    value={option.value.toString()} 
                    id={`${question.id}_${option.value}`}
                    className="border-2"
                  />
                  <Label 
                    htmlFor={`${question.id}_${option.value}`}
                    className="flex-1 text-sm cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-6">
              {currentQuestion > 0 ? (
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(prev => prev - 1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Zurück
                </Button>
              ) : (
                <div />
              )}

              {currentQuestion < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Weiter
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Wird versendet...
                    </>
                  ) : (
                    'Test abschließen'
                  )}
                </Button>
              )}
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Hallo {userSession.name}! Deine Antworten werden automatisch per E-Mail an uns gesendet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
