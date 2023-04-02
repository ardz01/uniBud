document.addEventListener('DOMContentLoaded', function () {
  const chatbotForm = document.getElementById('chatbot-form');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotOutput = document.getElementById('chatbot-output');
  const chatbotIcon = document.querySelector('.chatbot-icon');
  const chatbot = document.querySelector('.chatbot');
  const typingIndicator = document.createElement('div');
  typingIndicator.innerHTML = '<span class="typing-indicator"></span><span class="typing-indicator"></span><span class="typing-indicator"></span>';
  typingIndicator.style.display = 'none';
  chatbotOutput.appendChild(typingIndicator);

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
    const userMessage = document.createElement('div');
    userMessage.textContent = question;
    userMessage.className = 'user-message';
    chatbotOutput.appendChild(userMessage);
    scrollToBottom();

    // Clear the input after sending a message
    chatbotInput.value = "";

   // Show typing indicator
    typingIndicator.style.display = 'flex';
    console.log("Typing indicator should be visible now");

    // Simulate a delay before getting a response
    setTimeout(async function () {
        const response = await fetch(`/chatbot/ask/?question=${question}`);
        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Hide typing indicator
        typingIndicator.style.display = 'none';
        console.log("Typing indicator should be hidden now");
        const botMessage = document.createElement('div');
        botMessage.textContent = data.answer;
        botMessage.className = 'bot-message';
        chatbotOutput.appendChild(botMessage);
        scrollToBottom();
    }, 1500); // You can adjust the delay time (in milliseconds) as needed
});
});
