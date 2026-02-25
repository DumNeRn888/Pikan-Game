import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { doc, setDoc } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// สมัครสมาชิก
window.register = async function() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", userCred.user.uid), {
    email: email,
    role: "user",
    score: 0
  });

  alert("สมัครสำเร็จ");
  window.location = "index.html";
}

// ล็อกอิน
window.login = async function() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await signInWithEmailAndPassword(auth, email, password);

  window.location = "dashboard.html";
}