function handleFormSubmit(event) {
    event.preventDefault();
  
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotOutput = document.getElementById("chatbot-output");
    const question = chatbotInput.value;
  
    fetch(`/chatbot/ask/?question=${question}`)
      .then((response) => response.json())
      .then((data) => {
        chatbotOutput.textContent = data.answer;
      });
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotOutput = document.getElementById('chatbot-output');
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbot = document.querySelector('.chatbot');

    chatbotForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const question = chatbotInput.value;
        const response = await fetch(`/chatbot/ask/?question=${question}`);
        const data = await response.json();
        chatbotOutput.textContent = data.answer;
    });

    chatbotIcon.addEventListener('click', function () {
        if (chatbot.style.display === 'none') {
            chatbot.style.display = 'block';
        } else {
            chatbot.style.display = 'none';
        }
    });
});

  