export type QuestionCategory = 
| "growing-up"
| "family"
| "adult-life"
| "passions"
| "world-events"
| "wisdom"
| "love-life";

export const questions: Record<QuestionCategory, string[]> = {
    'growing-up': [
        "What's your earliest childhood memory?",
        "What was your childhood home like?",
        "Who were your best friends growing up?",
        "What games did you love to play as a child?",
        "What was school like for you?",
        "What did you want to be when you grew up?",
        "What were your favorite childhood traditions?",
        "Tell us about your childhood neighborhood",
        "What was your favorite toy or possession?",
        "What did you do during summer vacations?",
        "Who was your favorite teacher and why?",
        "What was the most mischievous thing you did as a child?"
    ],
    'family': [
        "What's your favorite family tradition?",
        "Tell us about your parents and what they were like",
        "What's the most important lesson your family taught you?",
        "What was dinnertime like in your family?",
        "Tell us about your siblings and your relationships",
        "What family recipes are special to you?",
        "What family stories do you remember most vividly?",
        "Who was the storyteller in your family?",
        "What holidays were most special to your family?",
        "Tell us about your grandparents",
        "What family heirlooms are most precious to you?",
        "What values did your family instill in you?"
    ],
    'adult-life': [
        "What was your first job?",
        "Tell us about your career journey",
        "What was your first home of your own like?",
        "What has been your proudest achievement?",
        "What was the biggest challenge you've overcome?",
        "What decisions changed the course of your life?",
        "What has been your biggest adventure?",
        "Tell us about your most memorable travel experience",
        "What skills are you most proud of learning?",
        "What has surprised you most about adult life?",
        "What advice would you give your younger self?",
        "What's been your biggest life lesson?"
    ], 
    'passions': [
        "What hobbies bring you the most joy?",
        "When did you discover your passion for what you love?",
        "What skills have you mastered over the years?",
        "What do you love learning about?",
        "What creative pursuits interest you?",
        "Tell us about your collections or interests",
        "What activities make you lose track of time?",
        "Who inspired your interests?",
        "What would you love to learn more about?",
        "What passion would you love to share with others?",
        "What drives your curiosity?",
        "What legacy would you like to leave in your field of interest?"
    ],
    'world-events': [
        "What historical events have you witnessed?",
        "How did major world events impact your life?",
        "What technological changes have amazed you most?",
        "What social changes have you seen in your lifetime?",
        "What historical moment do you remember most vividly?",
        "How has your community changed over time?",
        "What world event had the biggest impact on your family?",
        "What innovations have changed your life the most?",
        "What historical figure would you like to meet?",
        "What period of history interests you most?",
        "What predictions do you have for the future?",
        "What lessons should we learn from history?"
    ],
    'wisdom': [
        "What's the best advice you've ever received?",
        "What life lessons would you share with future generations?",
        "What do you know now that you wish you knew earlier?",
        "What values matter most to you?",
        "What's the secret to a happy life?",
        "What mistakes taught you the most?",
        "What traditions should be preserved?",
        "What makes a life well-lived?",
        "What brings true happiness?",
        "What principles guide your decisions?",
        "What legacy do you want to leave?",
        "What wisdom would you share with young people today?"
    ],
    'love-life': [
        "What was the best date you've ever been on?",
        "How did you meet your significant other?",
        "What's your favorite romantic memory?",
        "Tell us about your first love.",
        "What's the most romantic thing someone has done for you?",
        "What's your idea of a perfect date?",
        "What's the best relationship advice you've received?",
        "Tell us about a memorable anniversary.",
        "What made you fall in love with your partner?",
        "What's your love story?",
        "What does love mean to you?",
        "How do you keep the romance alive?"
    ]
};