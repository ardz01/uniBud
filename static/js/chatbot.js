document.addEventListener('DOMContentLoaded', function () {
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotOutput = document.getElementById('chatbot-output');
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbot = document.querySelector('.chatbot');

    function createBotMessage(text) {
        const botMessage = document.createElement('div');
        botMessage.textContent = text;
        botMessage.className = 'bot-message';
        chatbotOutput.appendChild(botMessage);
    }

    function scrollToBottom() {
      chatbotOutput.scrollTop = chatbotOutput.scrollHeight;
  }
    
    chatbotIcon.addEventListener('click', function () {
        if (chatbot.style.display === 'none') {
          chatbot.style.display = 'flex';
          if (!chatbotOutput.hasChildNodes()) {
            createBotMessage('Hi, how may I help you today?');
          }
        } else {
          chatbot.style.display = 'none';
        }
    });

    chatbotForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const question = chatbotInput.value;
        const response = await fetch(`/chatbot/ask/?question=${question}`);
        const data = await response.json();
        const userMessage = document.createElement('div');
        userMessage.textContent = question;
        userMessage.className = 'user-message';
        chatbotOutput.appendChild(userMessage);
        scrollToBottom();

        const botMessage = document.createElement('div');
        botMessage.textContent = data.answer;
        botMessage.className = 'bot-message';
        chatbotOutput.appendChild(botMessage);
        scrollToBottom();

        // Clear the input after sending a message
        chatbotInput.value = "";
    });
});
