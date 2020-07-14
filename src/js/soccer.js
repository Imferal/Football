'strict mode';

export default function soccer() {
  window.addEventListener('DOMContentLoaded', function() {

    let side = true; // В какую сторону летит мяч (true - влево, false - вправо)    
    let activeGoal; // Ворота, куда влетел мяч
    let newBallCoords; // Координаты мяча после удара
    let ball = $('.soccer__ball'); // Находим мяч    
    let score = [0, 0]; // Счёт в матче
    let comment = 'Что-то пошло не так! Вы не должны видеть это сообщение!';
    let goalName; // Название ворот на кириллице для комментария
    let scoreTimer;

    ball.addEventListener('click', function() {
      // Показываем счёт через 3 секунды
      clearTimeout(scoreTimer);
      scoreTimer = setTimeout(showScore, 3000);

      // Выбираем ворота для анимации
      activeGoal = getActiveGoal(activeGoal);


      // Выбираем правильное название стороны для уведомления    
      goalName = getGoalName(goalName);

      // Пересчитываем размеры поля, если экран изменился
      let fieldHeight = $('.soccer__playing-field').height(); // Высота поля
      let fieldWidth = $('.soccer__playing-field').width(); // Ширина поля      
      let goalTop = Math.round(fieldHeight / 2 + fieldHeight / 100 * 6.7); // Верхняя граница ворот
      let goalBottom = Math.round(fieldHeight / 2 - fieldHeight / 100 * 6.7); // Нижняя граница ворот

      // Вычисляем новые координаты для мяча
      let newBallCoords = getNewBallCoords(fieldHeight, fieldWidth); // Пересчитываем координаты мяча      

      // Анимируем удар по мячу
      ballAnimate(newBallCoords, checkGoal)

      // Проверка на попадание в ворота и изменение счёта, если попадание есть
      function checkGoal() {
        let goal = goalOrNot(newBallCoords, goalTop, goalBottom);
        if (goal) {
          setTimeout(goalAnimate(activeGoal), 1000);
          side ?
            score[1]++ :
            score[0]++
        }
      };

      // Добавление комментария
      addComments(newBallCoords, goalTop, goalBottom, goalName, fieldHeight, score);
    });

    // Функция выбора стороны удара
    function getActiveGoal(activeGoal) {
      side ? activeGoal = $('.soccer__goal_left') :
        activeGoal = $('.soccer__goal_right')
      return activeGoal
    }

    // Функция выбора правильного названия ворот
    function getGoalName(goalName) {
      side ? goalName = ' левые ' :
        goalName = ' правые '
      return goalName
    }

    // Функция анимации удара
    function ballAnimate(newBallCoords, checkGoal) {
      ball.animate({
        left: newBallCoords[0],
        top: newBallCoords[1]
      }, checkGoal);
    }

    // Функция анимации гола
    function goalAnimate(activeGoal) {
      const timer = setInterval(() => {
        activeGoal.toggle()
      }, 200);
      setTimeout(() => clearInterval(timer), 3000);
    }

    // Комментатор
    function addComments(newBallCoords, goalTop, goalBottom, goalName, fieldHeight) {

      newBallCoords[1] < goalTop && newBallCoords[1] > goalBottom ?
        comment = 'Мяч влетел в' + goalName + 'ворота! Гоооол!' :
        newBallCoords[1] > Math.round(fieldHeight / 2 + fieldHeight / 100 * 40) ||
        newBallCoords[1] < Math.round(fieldHeight / 2 - fieldHeight / 100 * 40) ?
        comment = 'Мяч улетает в самый угол поля! Очень неточный удар!' :
        newBallCoords[1] > Math.round(fieldHeight / 2 + fieldHeight / 100 * 15) ||
        newBallCoords[1] < Math.round(fieldHeight / 2 - fieldHeight / 100 * 15) ?
        comment = 'Мимо ворот! Нужно бить точнее!' :
        newBallCoords[1] > Math.round(fieldHeight / 2 + fieldHeight / 100 * 9) ||
        newBallCoords[1] < Math.round(fieldHeight / 2 - fieldHeight / 100 * 9) ?
        comment = 'Мяч пролетел совсем рядом со штангой! Ещё чуть-чуть и был бы гол!' :
        comment = 'Мяч попадает в перекладину! Какая досада!';

      // Выводим комментарий
      $('.soccer__comments').text(comment);

    }

    // Функция проверки попадания мяча в ворота
    function goalOrNot(newBallCoords, goalTop, goalBottom) {

      console.log('Положение мяча на кромке поля: ', newBallCoords[1]);
      console.log('Линия ворот: ', goalTop, goalBottom)

      if (newBallCoords[1] < goalTop && newBallCoords[1] > goalBottom) {
        return true
      } else {
        return false
      }
    }

    // Функция вычисления конечной точки
    function getNewBallCoords(fieldHeight, fieldWidth) {

      let x;
      side ? x = 0 : x = fieldWidth; // Задаём позицию по оси X
      let y = Math.floor(Math.random() * (fieldHeight + 1)); // Задаём позицию по оси Y

      side ? side = false : side = true; // Меняем сторону для следующего удара
      newBallCoords = [x, y];

      return newBallCoords;
    }

    // Функция показа счёта
    function showScore() {
      $('.soccer__comments').text('Счёт в матче ' + score[0] + ' : ' + score[1] + '.')
    }

  })
};