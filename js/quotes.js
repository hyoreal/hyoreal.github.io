const quotes = [
    {
        quote: "She knows what is the best purpose of education: not to be frightened by the best but to treat it as part of daily life.",
        translate: "그녀는 교육의 최상의 목적이 최상의 결과에 대해 놀라는 것이 아니라, 최상의 결과를 일상적인 일로 간주하는 것임을 안다.",
        author: "John Mason Brown",
    },
    {
        quote: "A youth is to be regarded with respect. How do you know that his future will not be equal to our present?",
        translate: "젊은이를 존중하라. 그들의 미래가 우리의 현재와 같지 않을지 어찌 아는가?",
        author: "Confucius",
    },
    {
        quote:"I find nothing more depressing than optimism.",
        translate: "긍정적 사고만큼 나를 우울하게 만드는 일은 없다.",
        author: "Paul Fussell",
    },
    {
        quote: "Life is as tedious as a twice-told tale, vexing the dull ear of a drowsy man.",
        translate: "인생은 같은 얘기를 또 듣는 것과 같이 나른한 사람의 흐릿한 귀를 거슬리게 한다.",
        author: "William Shakespeare",
    },
    {
        quote: "Life is a tale told by an idiot -- full of sound and fury, signifying nothing.",
        translate: "인생은 백치가 지껄이는 이야기와 같다. 시끄럽고 정신없으나 아무 뜻도 없다.",
        author: "William Shakespeare",
    },
    {
        quote: "There is more to life than increasing its speed",
        translate: "인생에는 서두르는 것 말고도 더 많은 것이 있다.",
        author: "Mahatma Gandhi",
    },
    {
        quote: "The endeavor to understand is the first and only basis of virtue.",
        translate: "이해하려고 노력하는 행동이 미덕의 첫 단계이자 유일한 기본이다.",
        author: "Baruch Spinoza",
    },
    {
        quote: 'It is no use saying, "We are doing our best." You have got to succeed in doing what is necessary.',
        translate: '"최선을 다하고 있다"라고 말해봤자 소용없다. 필요한 일을 함에 있어서는 반드시 성공해야 한다.',
        author: "Winston Churchill",
    },
    {
        quote: "The purpose of life is to fight maturity.",
        translate: "인생의 목적은 성숙하지 않기 위해 싸우는 것이다",
        author: "Dick Werthimer",
    },
    {
        quote: "It is not giving children more that spoils them; it is giving them more to avoid confrontation.",
        translate: "더 많이 준다고 아이를 망치는 게 아니다. 충돌을 피하려고 더 많이 주면 아이를 망친다.",
        author: "John Gray",
    },
    {
        quote: "Your happiness is defined by what makes your spirit sing.",
        translate: "당신의 행복은 무엇이 당신의 영혼을 노래하게 하는가에 따라 결정된다.",
        author: "Nancy Sullivan",
    },
    {
        quote: "The secret to creativity is knowing how to hide your sources.",
        translate: "창의성의 비밀은 자신의 창의력의 원천을 숨길 줄 아는 것이다.",
        author: "Albert Einstein",
    },
    {
        quote: "You cannot have a proud and chivalrous spirit if your conduct is mean and paltry; for whatever a man's actions are, such must be his spirit",
        translate: "행동이 비열하고 하찮다면 그 정신이 자랑스럽고 의로울 수 없습니다. 사람의 행동이야말로 그의 정신이기 때문입니다.",
        author: "Demosthenes"
    },
    {
        quote: "We know what we are, but not what we may be.",
        translate: "우리는 오늘은 이러고 있지만, 내일은 어떻게 될지 누가 알아요?",
        author: "William Shakespeare",
    },
];

const quote = document.querySelector("#quote p:first-child");
const translate = document.querySelector("#quote p:nth-child(2)");
const author = document.querySelector("#quote p:last-child");

const todaysQuote = quotes[Math.floor(Math.random() * quotes.length)];

quote.innerText = todaysQuote.quote;
translate.innerText = todaysQuote.translate;
author.innerText = todaysQuote.author;