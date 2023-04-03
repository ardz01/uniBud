document.addEventListener('DOMContentLoaded', function () {
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotOutput = document.getElementById('chatbot-output');
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbot = document.querySelector('.chatbot');
    const typingIndicatorWrapper = document.getElementById('typing-indicator');

    function createBotMessage(text) {
        const botMessageWrapper = document.createElement('div');
        botMessageWrapper.className = 'bot-message-wrapper';
      
        const chatbotAvatarAndName = document.createElement('div');
        chatbotAvatarAndName.className = 'chatbot-avatar-and-name';
      
        const chatbotAvatar = document.createElement('div');
        chatbotAvatar.className = 'chatbot-avatar chatbot-response-avatar';
        const avatarImg = document.createElement('img');
        const avatarSrc = document.getElementById('chatbot-avatar').dataset.avatarSrc;
        avatarImg.src = avatarSrc;
        avatarImg.alt = "Chatbot Avatar";
        chatbotAvatar.appendChild(avatarImg);
      
        const chatbotName = document.createElement('div');
        chatbotName.textContent = 'uniBot';
        chatbotName.className = 'chatbot-name';
      
        chatbotAvatarAndName.appendChild(chatbotAvatar);
        chatbotAvatarAndName.appendChild(chatbotName);
      
        const botMessage = document.createElement('div');
        botMessage.textContent = text;
        botMessage.className = 'bot-message';
      
        botMessageWrapper.appendChild(chatbotAvatarAndName);
        botMessageWrapper.appendChild(botMessage);
        chatbotOutput.appendChild(botMessageWrapper);
      }
      
      
    

    function createUserMessage(text) {
        const userMessageWrapper = document.createElement('div');
        userMessageWrapper.className = 'user-message-wrapper';
    
        const userMessage = document.createElement('div');
        userMessage.textContent = text;
        userMessage.className = 'user-message';
    
        userMessageWrapper.appendChild(userMessage);
        chatbotOutput.appendChild(userMessageWrapper);
    }



    function createOptionsMessage(options) {
        const optionsWrapper = document.createElement('div');
        optionsWrapper.className = 'options-wrapper';
    
        options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.className = 'option-button';
            optionButton.textContent = option.text;
            optionButton.addEventListener('click', async function () {
                createUserMessage(option.text);
                scrollToBottom();
    
                // Show typing indicator
                typingIndicatorWrapper.style.display = 'flex';
    
                // Simulate a delay before getting a response
                setTimeout(async function () {
                    await new Promise(resolve => setTimeout(resolve, 400));
    
                    // Hide typing indicator
                    typingIndicatorWrapper.style.display = 'none';
                    createBotMessage(option.response);
                    scrollToBottom();
                }, 400);
            });
            optionsWrapper.appendChild(optionButton);
        });
    
        chatbotOutput.appendChild(optionsWrapper);
    }
    




    function scrollToBottom() {
        chatbotOutput.scrollTop = chatbotOutput.scrollHeight;
    }

    chatbotIcon.addEventListener('click', function () {
        if (chatbot.style.display === 'none') {
            chatbot.style.display = 'flex';
            if (!chatbotOutput.hasChildNodes()) {
                createBotMessage('Hi, what information are you looking for?');
                createOptionsMessage([
                    { text: 'Study Tips', response: 'Here are some study tips: ...' },
                    { text: 'Clubs', response: 'We have a variety of clubs and organizations on campus! ...' },
                    { text: 'Events', response: 'There are many events happening on campus throughout the year, ...' },
                    { text: 'Housing', response: 'We offer a variety of housing options for students, ...' },
                ]);
            }
        } else {
            chatbot.style.display = 'none';
        }
    });
    

    chatbotForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const question = chatbotInput.value;
        createUserMessage(question);
        scrollToBottom();
      
        // Clear the input after sending a message
        chatbotInput.value = "";
      
        // Show typing indicator
        typingIndicatorWrapper.style.display = 'flex';
        console.log("Typing indicator should be visible now");
      
        // Simulate a delay before getting a response
        setTimeout(async function () {
          const response = await fetch(`/chatbot/ask/?question=${question}`);
          const data = await response.json();
          await new Promise(resolve => setTimeout(resolve, 400));
      
          // Hide typing indicator
          typingIndicatorWrapper.style.display = 'none';
          console.log("Typing indicator should be hidden now");
          createBotMessage(data.answer);
          scrollToBottom();
        }, 400); // You can adjust the delay time (in milliseconds) as needed
      });
});

document.querySelector('.chatbot-close').addEventListener('click', function() {
    document.querySelector('.chatbot').style.display = 'none';
  });
  