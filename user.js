import { db, auth } from "./firebase.js";
import { collection, getDocs, addDoc } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const matchList = document.getElementById("matchList");

// โหลดคู่แข่งขัน
const matches = await getDocs(collection(db, "matches"));

matches.forEach(doc => {
  const m = doc.data();

  if(m.status === "open"){

    matchList.innerHTML += `
      <div>
        ${m.teamA} 
        <input type="number" id="a_${doc.id}" style="width:50px">
        -
        <input type="number" id="b_${doc.id}" style="width:50px">
        ${m.teamB}
        <button onclick="savePrediction('${doc.id}')">ทายผล</button>
      </div>
    `;
  }
});

// บันทึกคำทาย
window.savePrediction = async function(matchId){

  const scoreA = document.getElementById("a_"+matchId).value;
  const scoreB = document.getElementById("b_"+matchId).value;

  await addDoc(collection(db, "predictions"), {
    uid: auth.currentUser.uid,
    matchId: matchId,
    scoreA: parseInt(scoreA),
    scoreB: parseInt(scoreB)
  });

  alert("บันทึกสำเร็จ");
}