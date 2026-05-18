export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
  explanation: string;
}

export const QUESTIONS_POOL: Question[] = [
  {
    id: 1,
    question: "Como o Curupira System detecta fumaça na floresta sem precisar de ninguém lá?",
    options: [
      { text: "Ele escuta o barulho dos animais correndo na mata. 🐦", isCorrect: false },
      { text: "Ele usa sensores inteligentes de qualidade do ar e calor. 📡", isCorrect: true },
      { text: "Ele espera a fumaça chegar na cidade para avisar. 🌫️", isCorrect: false },
    ],
    explanation: "O Curupira System usa sensores instalados no alto das árvores. Esses aparelhos medem os gases no ar e enviam um alerta de fumaça na hora para a central, agilizando o combate ao fogo! 📡🔥"
  },
  {
    id: 2,
    question: "Qual é o maior perigo das queimadas para os animais da Amazônia?",
    options: [
      { text: "A destruição de seus lares naturais e a fumaça que dificulta a respiração. 🐆", isCorrect: true },
      { text: "A temperatura da água dos rios que fica muito fria. 🐟", isCorrect: false },
      { text: "O barulho das chamas que atrapalha o sono dos bichos. 🐒", isCorrect: false },
    ],
    explanation: "O fogo consome as árvores que servem de casa e abrigo para aves, macacos e outros animais. A fumaça tóxica também irrita as vias aéreas e faz muito mal aos pulmões dos animais. 🫁🐆"
  },
  {
    id: 3,
    question: "Por que as árvores e florestas são tão importantes para a qualidade do ar?",
    options: [
      { text: "Porque suas folhas servem como guarda-chuvas naturais contra tempestades. ☔", isCorrect: false },
      { text: "Porque elas absorvem o ar poluído e liberam oxigênio puro. 🌳", isCorrect: true },
      { text: "Porque elas impedem o vento de soprar forte demais nas ruas. 💨", isCorrect: false },
    ],
    explanation: "As árvores limpam a nossa atmosfera! Através da fotossíntese, elas filtram o gás carbônico poluído do ar e nos devolvem oxigênio puro e umidade para respirarmos ar fresco. 🍃🌎"
  },
  {
    id: 4,
    question: "Por que queimar lixo doméstico ou folhas secas no quintal faz mal?",
    options: [
      { text: "Porque gera fumaça com gases tóxicos que prejudicam a respiração de todos. 😷", isCorrect: true },
      { text: "Porque o fogo pode danificar as calçadas e o asfalto da rua. 🧹", isCorrect: false },
      { text: "Porque a fumaça atrai insetos indesejados para dentro das residências. 🦟", isCorrect: false },
    ],
    explanation: "Queimar lixo ou folhas libera gases e fuligem fina que entram nas vias respiratórias. Isso causa tosse, irrita a garganta e pode agravar problemas como asma e bronquite. 🫁⚠️"
  },
  {
    id: 5,
    question: "Como as crianças podem ajudar a prevenir incêndios e proteger a floresta?",
    options: [
      { text: "Evitando desperdício de papel, cuidando de plantas e ensinando adultos a não usarem fogo. 🌟", isCorrect: true },
      { text: "Mudando-se para o meio da mata amazônica para vigiar as árvores. 🪵", isCorrect: false },
      { text: "Apenas assistindo a desenhos educativos sobre a floresta no celular. 📺", isCorrect: false },
    ],
    explanation: "Pequenas atitudes ajudam muito! Economizar papel poupa árvores do corte, e conversar com adultos sobre os riscos de queimar lixo ajuda a espalhar a semente da preservação. 🌱💚"
  },
  {
    id: 6,
    question: "O que é a 'fuligem' que vemos flutuando no ar perto de uma queimada?",
    options: [
      { text: "Pequenas partículas pretas de carvão e cinza que sobem com o fogo. ⚫", isCorrect: true },
      { text: "Um tipo de poeira brilhante que serve para adubar as flores. ✨", isCorrect: false },
      { text: "Folhas secas que se soltam das copas das árvores na ventania. 🍃", isCorrect: false },
    ],
    explanation: "A fuligem é o pó preto formado por restos de vegetação queimada. Ela viaja com o vento e, por ser muito fina, pode entrar facilmente no nosso nariz e nos nossos pulmões. 🫁💨"
  },
  {
    id: 7,
    question: "Qual é a cor que o céu costuma ficar quando há muitas queimadas por perto?",
    options: [
      { text: "Cinza escuro ou amarelado devido ao acúmulo de poeira e fumaça no ar. 🌫️", isCorrect: true },
      { text: "Azul muito brilhante por causa do calor extremo das chamas. ☀️", isCorrect: false },
      { text: "Verde brilhante por causa do reflexo das folhas que caem. 🍃", isCorrect: false },
    ],
    explanation: "A grande quantidade de fumaça e cinzas suspensas na atmosfera barra a passagem de parte da luz solar, deixando o dia nublado, cinzento e com um aspecto abafado. 🌫️🏙️"
  },
  {
    id: 8,
    question: "O que devemos fazer imediatamente se virmos um início de incêndio na mata?",
    options: [
      { text: "Tentar apagar o fogo sozinhos usando galhos e folhas verdes. 🪓", isCorrect: false },
      { text: "Avisar um adulto responsável para ligar para os Bombeiros no 193. 🚒", isCorrect: true },
      { text: "Chegar perto das chamas para fazer vídeos e postar na internet. 📱", isCorrect: false },
    ],
    explanation: "O fogo florestal espalha-se em segundos com o vento e é extremamente perigoso. O correto é afastar-se do local imediatamente e ligar para o Corpo de Bombeiros no 193. 👨‍🚒🔥"
  },
  {
    id: 9,
    question: "Por que o ar fica tão seco em épocas de seca e queimadas?",
    options: [
      { text: "Porque as chamas bebem toda a umidade presente na atmosfera. 💧", isCorrect: false },
      { text: "Porque a falta de chuva e a queima de árvores reduzem a umidade do ar. 🍂", isCorrect: true },
      { text: "Porque as nuvens fogem da região para evitar o calor das chamas. ☁️", isCorrect: false },
    ],
    explanation: "As árvores transpiram e jogam muita umidade no ar, criando as nuvens. Com menos árvores e falta de chuvas, o ar fica seco, o que dificulta a respiração e resseca a garganta. 🌵💨"
  },
  {
    id: 10,
    question: "Como as folhas das plantas ajudam a limpar a poeira e a sujeira do ar?",
    options: [
      { text: "Funcionando como filtros que prendem as partículas em suas superfícies. 🍃", isCorrect: true },
      { text: "Usando braços invisíveis para varrer a poeira de perto delas. 🧹", isCorrect: false },
      { text: "Assoprando a fumaça de volta para o espaço sideral. 🚀", isCorrect: false },
    ],
    explanation: "As superfícies das folhas seguram a fuligem e a poeira que flutuam no ar. Quando chove, essa água limpa as folhas e leva a sujeira para o solo, purificando a atmosfera. 🌧️🌳"
  },
  {
    id: 11,
    question: "Qual é o nome do personagem do folclore que inspirou o nome do Curupira System?",
    options: [
      { text: "Saci-Pererê, o menino travesso de uma perna só. 🌪️", isCorrect: false },
      { text: "Curupira, o guardião com os pés virados para trás. 🦊", isCorrect: true },
      { text: "Boitatá, a cobra de fogo que vive nos rios. 🐍", isCorrect: false },
    ],
    explanation: "O Curupira é o protetor lendário da floresta e dos animais contra destruidores da natureza. O Curupira System usa tecnologia para desempenhar esse mesmo papel de guardião! 🛡️🍃"
  },
  {
    id: 12,
    question: "Por que o vento é um fator perigoso quando existe uma queimada florestal?",
    options: [
      { text: "Porque ele apaga o fogo impedindo o calor de se espalhar. 🌬️", isCorrect: false },
      { text: "Porque ele leva oxigênio para as chamas e espalha faíscas rapidamente. 🌪️", isCorrect: true },
      { text: "Porque ele faz os bombeiros sentirem muito frio durante o trabalho. ❄️", isCorrect: false },
    ],
    explanation: "O vento traz mais oxigênio, que serve de combustível para o fogo, e transporta brasas acesas para áreas ainda intactas da mata, iniciando novos focos de incêndio. 🌬️🔥"
  },
  {
    id: 13,
    question: "O que é o reflorestamento, uma atividade que ajuda a recuperar o meio ambiente?",
    options: [
      { text: "O ato de retirar árvores velhas para abrir espaço para plantações. 🪓", isCorrect: false },
      { text: "O plantio de novas árvores em locais onde a floresta foi derrubada ou queimada. 🌳", isCorrect: true },
      { text: "O processo de levar os animais urbanos de volta para a selva. 🐆", isCorrect: false },
    ],
    explanation: "Reflorestar consiste em plantar árvores típicas da região em locais que sofreram queimadas ou desmatamento, ajudando a trazer de volta a fauna e a refrescar o clima. 🌲🍃"
  },
  {
    id: 14,
    question: "Por que respirar fumaça de incêndio faz as pessoas tossirem?",
    options: [
      { text: "Porque a tosse é uma defesa do corpo para expelir a fuligem que entrou. 🫁", isCorrect: true },
      { text: "Porque a fumaça faz cócegas na garganta de quem respira. 💬", isCorrect: false },
      { text: "Porque a tosse indica que a pessoa precisa beber muita água gelada. 💧", isCorrect: false },
    ],
    explanation: "A tosse é um reflexo protetor! Os pulmões e vias aéreas contraem-se para tentar expulsar as pequenas sujeiras e cinzas tóxicas que entram junto com a fumaça. 🫁⚠️"
  },
  {
    id: 15,
    question: "Que material reciclado comum economiza o corte de árvores quando reaproveitado?",
    options: [
      { text: "Papel e papelão, pois são produzidos a partir das fibras de árvores. 📄", isCorrect: true },
      { text: "Garrafas e potes feitos de vidro comum. 🫙", isCorrect: false },
      { text: "Latas de refrigerante feitas de alumínio. 🥤", isCorrect: false },
    ],
    explanation: "O papel é fabricado a partir da celulose das árvores. Ao usarmos papel de forma consciente e reciclá-lo, reduzimos a necessidade de derrubar mais árvores na floresta! 🌲🍃"
  }
];
