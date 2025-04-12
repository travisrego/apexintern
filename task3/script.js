// Quiz Logic
function checkAnswer() {
    const answer = document.querySelector('input[name="q1"]:checked');
    const result = document.getElementById('quiz-result');
    if (!answer) {
      result.textContent = 'Please select an answer!';
    } else {
      result.textContent = answer.value === 'correct' ? '✅ Correct!' : '❌ Try again!';
    }
  }
  
  // Carousel Logic
  const images = [
    'https://picsum.photos/id/1015/400/300',
    'https://picsum.photos/id/1016/400/300',
    'https://picsum.photos/id/1025/400/300'
  ];
  let index = 0;
  
  function nextImage() {
    index = (index + 1) % images.length;
    document.getElementById('carousel-img').src = images[index];
  }
  
  // Joke API Logic
  async function getJoke() {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
    const data = await response.json();
    document.getElementById('joke-text').textContent = `${data.setup} - ${data.punchline}`;
  }
  