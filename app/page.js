'use client';

import { useState } from 'react';

const ANALYSIS_FRAMEWORK = {
  paralysisAnalysis: [
    { q: 'Сколько бизнес-идей у вас было за 5 лет?', type: 'number', key: 'ideas' },
    { q: 'Сколько из них вы детально проработали?', type: 'number', key: 'detailed' },
    { q: 'Вы обычно ищете "идеальную" идею перед стартом?', type: 'yesno', key: 'perfectIdea' },
    { q: 'Вы тратите больше времени на обучение или на действия?', type: 'choice', options: ['обучение', 'действия', 'примерно поровну'], key: 'timeSpent' },
  ],
  fearAnalysis: [
    { q: 'Оцените страх потери денег (0-10)', type: 'scale', key: 'moneyFear' },
    { q: 'Оцените страх неудачи/осуждения (0-10)', type: 'scale', key: 'failureFear' },
    { q: 'Были ли у вас попытки старта, которые вы отменили в последний момент?', type: 'yesno', key: 'cancelled' },
    { q: 'Есть ли у вас финансовая подушка на 3+ месяца?', type: 'yesno', key: 'savings' },
  ],
  executionAnalysis: [
    { q: 'Вы когда-либо продавали что-либо (даже на Avito)?', type: 'yesno', key: 'sold' },
    { q: 'Вы разговаривали с потенциальными клиентами о своих идеях?', type: 'yesno', key: 'talkedClients' },
    { q: 'Самое далёкое действие, которое вы совершили:', type: 'choice', options: ['только думал', 'изучал рынок', 'сделал прототип/сайт', 'пытался продать', 'зарегистрировал ИП/ООО'], key: 'furthestAction' },
    { q: 'Что обычно останавливает?', type: 'multichoice', options: ['нет денег', 'нет времени', 'не знаю как', 'страшно', 'нет идеи', 'нужно еще поучиться'], key: 'stoppers' },
  ]
};

export default function Home() {
  const [stage, setStage] = useState('intro');
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const sections = ['paralysisAnalysis', 'fearAnalysis', 'executionAnalysis'];
  const sectionNames = ['Анализ паралича', 'Анализ страхов', 'Анализ действий'];

  const handleAnswer = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };

  const nextQuestion = () => {
    const currentSectionQuestions = ANALYSIS_FRAMEWORK[sections[currentSection]];

    if (currentQuestion < currentSectionQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    } else {
      analyzeResults();
    }
  };

  const analyzeResults = () => {
    const diagnosis = {
      mainProblem: '',
      subProblems: [],
      actionPlan: [],
      severity: 0
    };

    // Analysis Paralysis Detection
    if (answers.ideas > 10 || answers.timeSpent === 'обучение' || answers.perfectIdea === 'yes') {
      diagnosis.mainProblem = 'ПАРАЛИЧ АНАЛИЗА';
      diagnosis.subProblems.push('Вы застряли в цикле обучения и поиска идеальной идеи');
      diagnosis.severity += 40;
      diagnosis.actionPlan.push({
        title: 'НЕМЕДЛЕННО: Правило 48 часов',
        action: 'Выберите ЛЮБУЮ идею из списка. За 48 часов сделайте микро-MVP: посадочную страницу или пост в соцсетях с предложением. Не думайте - делайте.',
        why: 'Ваш мозг научился откладывать. Нужно сломать паттерн срочным действием.'
      });
    }

    // Fear Detection
    if (answers.moneyFear > 7 || answers.failureFear > 7 || answers.cancelled === 'yes') {
      if (!diagnosis.mainProblem) diagnosis.mainProblem = 'БЛОКИРУЮЩИЙ СТРАХ';
      diagnosis.subProblems.push('Страх неудачи/потери денег парализует действия');
      diagnosis.severity += 35;
      diagnosis.actionPlan.push({
        title: 'Стратегия нулевого риска',
        action: 'Начните бизнес БЕЗ вложений: предпродажа услуги, которую умеете делать. Возьмите заказ СНАЧАЛА, сделайте ПОТОМ. Бюджет: 0₽.',
        why: 'Вы боитесь потерь. Если нечего терять - страх исчезает.'
      });
    }

    // Execution Problem
    if (answers.sold === 'no' || answers.talkedClients === 'no' ||
        ['только думал', 'изучал рынок'].includes(answers.furthestAction)) {
      if (!diagnosis.mainProblem) diagnosis.mainProblem = 'ОТСУТСТВИЕ РЕАЛЬНЫХ ДЕЙСТВИЙ';
      diagnosis.subProblems.push('Вы никогда не пытались реально продавать');
      diagnosis.severity += 45;
      diagnosis.actionPlan.push({
        title: 'КРИТИЧНО: Первая продажа за неделю',
        action: 'Выберите навык, который есть у вас (дизайн, тексты, консультации, ремонт). Сегодня разместите объявление на Avito/соцсетях. Цель: 1 клиент за 7 дней. Цена - любая, даже символическая.',
        why: 'Вы не понимаете, что такое бизнес, потому что никогда не продавали. Это ОБЯЗАТЕЛЬНЫЙ опыт.'
      });
    }

    // Chronic Stopper Detection
    if (answers.stoppers?.includes('нужно еще поучиться') || answers.stoppers?.includes('не знаю как')) {
      diagnosis.subProblems.push('Синдром "недостаточной квалификации"');
      diagnosis.actionPlan.push({
        title: 'ЗАПРЕТ на обучение',
        action: 'На 30 дней - ПОЛНЫЙ ЗАПРЕТ на курсы, книги, видео. Только действия. Учитесь на своих ошибках, а не на чужих лекциях.',
        why: 'Обучение стало способом избегания действий. Вы знаете достаточно - проблема не в знаниях.'
      });
    }

    // No Money Excuse
    if (answers.stoppers?.includes('нет денег') && answers.savings === 'no') {
      diagnosis.actionPlan.push({
        title: 'Деньги - НЕ проблема',
        action: 'Сервисный бизнес: берите заказы на фриланс-платформах (Kwork, FL.ru, Youdo). Инвестиции: 0₽. Первые деньги - через 1-2 недели.',
        why: 'У 90% успешных бизнесов стартовый капитал был близок к нулю. Отсутствие денег - отговорка, а не причина.'
      });
    }

    // Ultimate Action Plan
    diagnosis.actionPlan.push({
      title: 'Контракт с собой (главное правило)',
      action: 'СЕГОДНЯ: выберите одно действие из списка выше. Публично пообещайте кому-то результат через неделю. Без публичного обязательства - вы снова сорвётесь.',
      why: 'За 5 лет вы доказали, что внутренней мотивации недостаточно. Нужна внешняя ответственность.'
    });

    setResults(diagnosis);
    setStage('results');
  };

  const renderQuestion = () => {
    const question = ANALYSIS_FRAMEWORK[sections[currentSection]][currentQuestion];

    return (
      <div style={styles.questionContainer}>
        <div style={styles.progress}>
          {sectionNames[currentSection]} • Вопрос {currentQuestion + 1} из {ANALYSIS_FRAMEWORK[sections[currentSection]].length}
        </div>

        <h2 style={styles.question}>{question.q}</h2>

        <div style={styles.answerZone}>
          {question.type === 'number' && (
            <input
              type="number"
              style={styles.input}
              onChange={(e) => handleAnswer(question.key, parseInt(e.target.value))}
              placeholder="Введите число"
            />
          )}

          {question.type === 'yesno' && (
            <div style={styles.buttonGroup}>
              <button style={styles.button} onClick={() => { handleAnswer(question.key, 'yes'); setTimeout(nextQuestion, 300); }}>Да</button>
              <button style={styles.button} onClick={() => { handleAnswer(question.key, 'no'); setTimeout(nextQuestion, 300); }}>Нет</button>
            </div>
          )}

          {question.type === 'scale' && (
            <div>
              <input
                type="range"
                min="0"
                max="10"
                style={{ width: '100%', height: '40px' }}
                onChange={(e) => handleAnswer(question.key, parseInt(e.target.value))}
              />
              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '24px', fontWeight: 'bold' }}>
                {answers[question.key] || 0}
              </div>
            </div>
          )}

          {question.type === 'choice' && (
            <div style={styles.buttonGroup}>
              {question.options.map(opt => (
                <button key={opt} style={styles.choiceButton} onClick={() => { handleAnswer(question.key, opt); setTimeout(nextQuestion, 300); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {question.type === 'multichoice' && (
            <div style={styles.buttonGroup}>
              {question.options.map(opt => (
                <button
                  key={opt}
                  style={{
                    ...styles.choiceButton,
                    backgroundColor: answers[question.key]?.includes(opt) ? '#4CAF50' : '#fff',
                    color: answers[question.key]?.includes(opt) ? '#fff' : '#333',
                  }}
                  onClick={() => {
                    const current = answers[question.key] || [];
                    const newValue = current.includes(opt)
                      ? current.filter(x => x !== opt)
                      : [...current, opt];
                    handleAnswer(question.key, newValue);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {question.type !== 'yesno' && question.type !== 'choice' && (
          <button style={styles.nextButton} onClick={nextQuestion}>
            Далее →
          </button>
        )}
      </div>
    );
  };

  if (stage === 'intro') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🎯 Диагностика Бизнес-Блоков</h1>
          <p style={styles.subtitle}>5 лет без старта - это не случайность. Это системная проблема.</p>

          <div style={styles.infoBox}>
            <h3>Что вы получите:</h3>
            <ul style={styles.list}>
              <li>Точную диагностику вашего главного блока</li>
              <li>Персональный план разблокировки</li>
              <li>Конкретные действия на ближайшие 7 дней</li>
              <li>Без абстракций - только то, что работает</li>
            </ul>
          </div>

          <p style={styles.warning}>⚠️ Это не мотивационная беседа. Будет жёстко, но честно.</p>

          <button style={styles.startButton} onClick={() => setStage('questions')}>
            Начать диагностику
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'questions') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          {renderQuestion()}
        </div>
      </div>
    );
  }

  if (stage === 'results' && results) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.diagnosisTitle}>📊 ДИАГНОЗ</h1>

          <div style={{...styles.diagnosisBox, borderLeftColor: results.severity > 60 ? '#f44336' : results.severity > 40 ? '#ff9800' : '#4CAF50'}}>
            <h2 style={styles.mainProblem}>{results.mainProblem}</h2>
            <div style={styles.severityBar}>
              <div style={{...styles.severityFill, width: `${results.severity}%`}}></div>
            </div>
            <p style={styles.severityText}>Уровень блокировки: {results.severity}%</p>
          </div>

          {results.subProblems.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Что именно не так:</h3>
              {results.subProblems.map((problem, i) => (
                <div key={i} style={styles.problemItem}>• {problem}</div>
              ))}
            </div>
          )}

          <div style={styles.section}>
            <h3 style={{...styles.sectionTitle, color: '#4CAF50'}}>🚀 ПЛАН ДЕЙСТВИЙ</h3>
            <p style={styles.planIntro}>Следуйте этому плану строго по порядку. Без отклонений.</p>

            {results.actionPlan.map((step, i) => (
              <div key={i} style={styles.actionCard}>
                <div style={styles.actionNumber}>{i + 1}</div>
                <div style={styles.actionContent}>
                  <h4 style={styles.actionTitle}>{step.title}</h4>
                  <p style={styles.actionText}><strong>Что делать:</strong> {step.action}</p>
                  <p style={styles.actionWhy}><strong>Почему это важно:</strong> {step.why}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.urgencyBox}>
            <h3 style={styles.urgencyTitle}>⏰ КРИТИЧНО</h3>
            <p style={styles.urgencyText}>
              Если через 7 дней вы не сделали хотя бы первый шунт из плана - проблема не в обстоятельствах.
              Проблема в том, что вы не хотите бизнес. Вы хотите ИДЕЮ бизнеса.
            </p>
            <p style={styles.urgencyText}>
              Бизнес = действия. Всё остальное - самообман.
            </p>
          </div>

          <button style={styles.restartButton} onClick={() => {
            setStage('intro');
            setCurrentSection(0);
            setCurrentQuestion(0);
            setAnswers({});
            setResults(null);
          }}>
            ← Пройти заново
          </button>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: '42px',
    marginBottom: '10px',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '20px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '25px',
  },
  list: {
    lineHeight: '1.8',
    fontSize: '16px',
    color: '#444',
  },
  warning: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#ff5722',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  startButton: {
    width: '100%',
    padding: '18px',
    fontSize: '20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  questionContainer: {
    minHeight: '400px',
  },
  progress: {
    fontSize: '14px',
    color: '#999',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  question: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '40px',
    lineHeight: '1.4',
  },
  answerZone: {
    marginBottom: '30px',
    minHeight: '120px',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    border: '2px solid #ddd',
    borderRadius: '8px',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  button: {
    padding: '15px 30px',
    fontSize: '18px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  choiceButton: {
    padding: '15px',
    fontSize: '16px',
    backgroundColor: 'white',
    color: '#333',
    border: '2px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  nextButton: {
    padding: '15px 40px',
    fontSize: '18px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  diagnosisTitle: {
    fontSize: '36px',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  diagnosisBox: {
    borderLeft: '6px solid',
    padding: '25px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  mainProblem: {
    fontSize: '28px',
    color: '#d32f2f',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  severityBar: {
    width: '100%',
    height: '12px',
    backgroundColor: '#e0e0e0',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '10px',
  },
  severityFill: {
    height: '100%',
    backgroundColor: '#f44336',
    transition: 'width 1s ease',
  },
  severityText: {
    fontSize: '14px',
    color: '#666',
  },
  section: {
    marginBottom: '35px',
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '15px',
    color: '#333',
  },
  problemItem: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#555',
    marginBottom: '8px',
  },
  planIntro: {
    fontSize: '16px',
    color: '#666',
    fontStyle: 'italic',
    marginBottom: '20px',
  },
  actionCard: {
    display: 'flex',
    gap: '20px',
    backgroundColor: '#fff',
    border: '2px solid #4CAF50',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
  },
  actionNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#4CAF50',
    minWidth: '50px',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#444',
    marginBottom: '10px',
  },
  actionWhy: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#666',
    fontStyle: 'italic',
  },
  urgencyBox: {
    backgroundColor: '#fff3cd',
    border: '3px solid #ff9800',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '30px',
  },
  urgencyTitle: {
    fontSize: '22px',
    color: '#ff6f00',
    marginBottom: '15px',
  },
  urgencyText: {
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#333',
    marginBottom: '10px',
  },
  restartButton: {
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#999',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
