// Notifications
const icon = 'https://pbs.twimg.com/profile_images/1114287107370098692/3PoMSfsZ.png';
const createNotification = ({username, message}) => notification(`${username}: ${message}`);
const notification = body => new Notification("Codeable's chat", {body, icon});

const notificationBtn  = document.querySelector('#enableNotifications');
const checkNotificationPromise = () => {
  try {
    Notification.requestPermission.then();
  } catch(e) {
    return false;
  }

  return true;
};

const requestNotificationPermission = () => {
  const handlePermission = permission => {
    console.log(permission)
    if(!('permission' in Notification)) Notification.permission = permission;

    notificationsAreNotEnabled = Notification.permission === 'denied' || Notification.permission === 'default';

    notificationBtn.style.display = notificationsAreNotEnabled ? 'block'  : 'none';

    if(!('Notification' in window)) return console.log('Notifications not supported in this browser!');

    if(checkNotificationPromise()) {
      Notification.requestPermission().then(handlePermission);
    } else {
      Notification.requestPermission(handlePermission);
    }


  };
};


notificationBtn.onclick = requestNotificationPermission;


// Chat
const initial_username = prompt('Username:') || 'Anonymous';
let usernameEl = document.querySelector('#username');
usernameEl.value = initial_username.split(" ").join("").slice(0,21);
const ws = new WebSocket('ws://localhost:3000');
const log = document.querySelector('#log');
const generateDate = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  });
};

document.querySelector('button').onclick = e => {
  let message = document.querySelector('#text').value;
  let username = usernameEl.value;
  ws.send(JSON.stringify({username, message}));

  log.innerHTML += `${generateDate()} You: ${message} <br>`;
};

ws.onopen = e => {
  ws.send(JSON.stringify({username:'SERVER', message: `${initial_username} online`}));
};

ws.onmessage = e => {
  let data  = JSON.parse(e.data);
  createNotification(data);
  log.innerHTML += `${generateDate()} ${data.username}: ${data.message} <br>`; 
};

ws.onerror = console.error;
