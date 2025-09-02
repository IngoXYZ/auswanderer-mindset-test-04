
// EmailJS Konfiguration
// WICHTIG: Diese Werte müssen durch deine echten EmailJS Credentials ersetzt werden!

export const EMAILJS_CONFIG = {
  // Ersetze mit deinen echten EmailJS Werten:
  serviceId: 'service_auswanderer',      // Dein EmailJS Service ID
  templateId: 'template_quiz_results',   // Dein EmailJS Template ID  
  publicKey: 'your_public_key_here'      // Dein EmailJS Public Key
};

// EmailJS Template Beispiel:
// 
// Betreff: Neue Auswanderer-Test Teilnahme - {{user_name}}
//
// Inhalt:
// Hallo,
// 
// ein neuer Teilnehmer hat den Auswanderer-Mindset Test ausgefüllt:
//
// TEILNEHMER-DATEN:
// Name: {{user_name}}
// E-Mail: {{user_email}}
// Datum: {{submission_date}}
//
// QUIZ-ERGEBNISSE:
// Gesamtpunktzahl: {{total_score}}/{{max_score}}
// Auswanderer-Typ: {{result_type}}
//
// KATEGORIE-SCORES:
// • Anpassungsfähigkeit: {{adaptability_score}}/5
// • Risikobereitschaft: {{risk_tolerance_score}}/5
// • Finanzielle Situation: {{financial_situation_score}}/5
// • Wertekompass: {{values_compass_score}}/5
// • Sicherheitsbedürfnis: {{security_needs_score}}/5
//
// EMPFEHLUNGEN:
// {{recommendations}}
//
// Viele Grüße,
// The Small Reset Auswanderer-Test
