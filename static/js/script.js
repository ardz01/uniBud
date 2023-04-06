// // Actions:

// const closeButton = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
// <title>remove</title>
// <path d="M27.314 6.019l-1.333-1.333-9.98 9.981-9.981-9.981-1.333 1.333 9.981 9.981-9.981 9.98 1.333 1.333 9.981-9.98 9.98 9.98 1.333-1.333-9.98-9.98 9.98-9.981z"></path>
// </svg>
// `;
// const menuButton = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
// <title>ellipsis-horizontal</title>
// <path d="M16 7.843c-2.156 0-3.908-1.753-3.908-3.908s1.753-3.908 3.908-3.908c2.156 0 3.908 1.753 3.908 3.908s-1.753 3.908-3.908 3.908zM16 1.98c-1.077 0-1.954 0.877-1.954 1.954s0.877 1.954 1.954 1.954c1.077 0 1.954-0.877 1.954-1.954s-0.877-1.954-1.954-1.954z"></path>
// <path d="M16 19.908c-2.156 0-3.908-1.753-3.908-3.908s1.753-3.908 3.908-3.908c2.156 0 3.908 1.753 3.908 3.908s-1.753 3.908-3.908 3.908zM16 14.046c-1.077 0-1.954 0.877-1.954 1.954s0.877 1.954 1.954 1.954c1.077 0 1.954-0.877 1.954-1.954s-0.877-1.954-1.954-1.954z"></path>
// <path d="M16 31.974c-2.156 0-3.908-1.753-3.908-3.908s1.753-3.908 3.908-3.908c2.156 0 3.908 1.753 3.908 3.908s-1.753 3.908-3.908 3.908zM16 26.111c-1.077 0-1.954 0.877-1.954 1.954s0.877 1.954 1.954 1.954c1.077 0 1.954-0.877 1.954-1.954s-0.877-1.954-1.954-1.954z"></path>
// </svg>
// `;

// const actionButtons = document.querySelectorAll('.action-button');

// if (actionButtons) {
//   actionButtons.forEach(button => {
//     button.addEventListener('click', () => {
//       const buttonId = button.dataset.id;
//       let popup = document.querySelector(`.popup-${buttonId}`);
//       console.log(popup);
//       if (popup) {
//         button.innerHTML = menuButton;
//         return popup.remove();
//       }

//       const deleteUrl = button.dataset.deleteUrl;
//       const editUrl = button.dataset.editUrl;
//       button.innerHTML = closeButton;

//       popup = document.createElement('div');
//       popup.classList.add('popup');
//       popup.classList.add(`popup-${buttonId}`);
//       popup.innerHTML = `<a href="${editUrl}">Edit</a>
//       <form action="${deleteUrl}" method="delete">
//         <button type="submit">Delete</button>
//       </form>`;
//       button.insertAdjacentElement('afterend', popup);
//     });
//   });
// }

// Menu

const dropdownMenu = document.querySelector(".dropdown-menu");
const dropdownButton = document.querySelector(".dropdown-button");

if (dropdownButton) {
  dropdownButton.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });
}

// Upload Image
const photoInput = document.querySelector("#avatar");
const photoPreview = document.querySelector("#preview-avatar");
if (photoInput)
  photoInput.onchange = () => {
    const [file] = photoInput.files;
    if (file) {
      photoPreview.src = URL.createObjectURL(file);
    }
  };

// Scroll to Bottom
const conversationThread = document.querySelector(".room__box");
if (conversationThread) conversationThread.scrollTop = conversationThread.scrollHeight;


// inbox

document.querySelectorAll('.message').forEach((message) => {
  message.addEventListener('click', (event) => {
    event.preventDefault();
    const messageId = message.getAttribute('data-message-id');
    
    // Fetch the message content
    fetch(`/message/${messageId}/`) // Update this URL with the correct route to fetch the message
      .then((response) => response.text())
      .then((html) => {
        // Update the message view with the fetched content
        document.querySelector('.message-view').innerHTML = html;
      })
      .catch((error) => {
        console.error('Error fetching message:', error);
      });
  });
});


//Feed Component

document.addEventListener('DOMContentLoaded', () => {
  const upvoteForms = document.querySelectorAll('.upvote-form');

  // Upvote event listener
  upvoteForms.forEach(form => {
      const upvoteContainer = form.querySelector('.upvote-container');

      upvoteContainer.addEventListener('click', (event) => {
          event.preventDefault();

          const formData = new FormData(form);
          fetch(form.action, {
              method: 'POST',
              headers: {
                  'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
              },
              body: formData,
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  form.querySelector('.upvote-count').textContent = data.upvotes;
              }
          });
      });
  });

  // Remove the downvote event listener
});



//ROOM JS

document.querySelectorAll('.dropdown-button').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Toggle the 'show-icon' class for the clicked dropdown button
    const adminIcons = event.target.closest('.participant').querySelectorAll('.admin-icon');
    adminIcons.forEach((icon) => {
      icon.classList.toggle('show-icon');
    });
  });
});


document.querySelectorAll('.kick-out').forEach((icon) => {
  icon.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default behavior
    event.stopPropagation(); // Prevent the click event from propagating to the participant element
    const userId = event.target.closest('.kick-out').dataset.userId;
    const roomId = document.querySelector('.participants__list').dataset.roomId;
    location.href = `/room/${roomId}/kick-out/${userId}/`;
  });
});

document.querySelectorAll('.make-admin').forEach((icon) => {
  icon.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const userId = event.target.closest('.make-admin').dataset.userId;
    const roomId = document.querySelector('.participants__list').dataset.roomId;
    location.href = `/room/${roomId}/make-admin/${userId}/`;
  });
});

document.querySelectorAll('.un-admin').forEach((icon) => {
  icon.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const userId = event.target.closest('.un-admin').dataset.userId;
    const roomId = document.querySelector('.participants__list').dataset.roomId;
    location.href = `/room/${roomId}/un-admin/${userId}/`;
  });
});


// Move participants to the correct divs based on their roles
document.querySelectorAll('.participant').forEach((participant) => {
  if (participant.classList.contains('owner')) {
    document.querySelector('.owner').appendChild(participant);
  } else if (participant.classList.contains('admin')) {
    document.querySelector('.admins').appendChild(participant);
  } else {
    document.querySelector('.members').appendChild(participant);
  }
})


//invite

function toggleInviteDropdown() {
  console.log("toggleInviteDropdown called");
  var dropdown = document.getElementById("inviteDropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function showMessage(message) {
  const messageContainer = document.createElement('div');
  messageContainer.className = 'message-container';
  messageContainer.innerText = message;

  document.body.appendChild(messageContainer);

  setTimeout(() => {
    messageContainer.remove();
  }, 3000);
}



function inviteUser(userPk) {
  console.log("inviteUser called with userPk:", userPk);
  var dropdown = document.getElementById("inviteDropdown");
  const roomPk = dropdown.getAttribute("data-room-pk");
  const inviteUrl = `/room/${roomPk}/invite/${userPk}/`;

  fetch(inviteUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  }).then(response => {
    if (response.status === 204) {
      showMessage('Invitation sent!');
    } else {
      showMessage('Failed to send the invitation.');
    }
  });
}



//random search icon

function getRandomIcon() {
  const icons = [
    '/static/images/icons/homework.png',
    '/static/images/icons/book-day.png',
    '/static/images/icons/studying.png',
    '/static/images/icons/knowledge.png',
    '/static/images/icons/paint-kit-dynamic-color.png',
    // Add more image paths here
  ];

  const randomIndex = Math.floor(Math.random() * icons.length);
  return icons[randomIndex];
}

function setRandomSearchIcon() {
  const searchAddon = document.querySelector('.search-addon');
  const iconPath = getRandomIcon();
  searchAddon.style.backgroundImage = `url('${iconPath}')`;
}

document.addEventListener('DOMContentLoaded', setRandomSearchIcon);

//search icon

const searchInput = document.querySelector('input[name="q"]');
const searchIcon = document.querySelector('.search-icon');

searchInput.addEventListener('focus', () => {
  searchIcon.classList.add('active');
});

searchInput.addEventListener('blur', () => {
  searchIcon.classList.remove('active');
});



//emojis



  function showEmojiPicker(event, messageId) {
    event.stopPropagation();
    const emojiPicker = document.getElementById(`emojiPicker-${messageId}`);
    emojiPicker.style.display = emojiPicker.style.display === "none" ? "block" : "none";
  }

  function addReaction(messageId, emoji) {
    const csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/add_reaction/", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-CSRFToken", csrfToken);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log('Received response:', response);
        if (response.status === "ok") {
          // Find the corresponding message-reactions div
          const messageReactions = document.querySelector(`.message-reactions[data-message-id="${messageId}"]`);
  
          // Create a new reaction span and set its content to the chosen emoji
          const newReaction = document.createElement("span");
          newReaction.className = "reaction";
          newReaction.textContent = emoji;
  
          // Append the new reaction to the message-reactions div
          messageReactions.appendChild(newReaction);
  
          // Hide the emoji picker
          const emojiPicker = document.getElementById(`emojiPicker-${messageId}`);
          emojiPicker.style.display = "none";
        } else {
          console.error("Error adding reaction");
        }
      }
    };
    xhr.send(`message_id=${messageId}&emoji=${emoji}`);
  }
  

  // Close the emoji picker when clicking outside of it
  document.addEventListener('click', (event) => {
    const emojiPickers = document.getElementsByClassName('emoji-picker');
    for (let i = 0; i < emojiPickers.length; i++) {
      emojiPickers[i].style.display = 'none';
    }
  });



