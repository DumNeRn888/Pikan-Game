import { db } from "./firebase.js";
import { collection, addDoc, getDocs, updateDoc, doc, increment } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// เพิ่มคู่
window.addMatch = async function(){

  await addDoc(collection(db, "matches"), {
    teamA: document.getElementById("teamA").value,
    teamB: document.getElementById("teamB").value,
    realA: null,
    realB: null,
    status: "open"
  });

  alert("เพิ่มคู่สำเร็จ");
}

// โหลดคู่เพื่อใส่ผล
const adminMatches = document.getElementById("adminMatches");
const matches = await getDocs(collection(db, "matches"));

matches.forEach(docu => {
  const m = docu.data();

  if(m.status === "open"){

    adminMatches.innerHTML += `
      <div>
        ${m.teamA}
        <input type="number" id="realA_${docu.id}" style="width:50px">
        -
        <input type="number" id="realB_${docu.id}" style="width:50px">
        ${m.teamB}
        <button onclick="closeMatch('${docu.id}')">ปิดผล</button>
      </div>
    `;
  }
});

// ปิดผล + คำนวณคะแนน
window.closeMatch = async function(matchId){

  const realA = parseInt(document.getElementById("realA_"+matchId).value);
  const realB = parseInt(document.getElementById("realB_"+matchId).value);

  await updateDoc(doc(db,"matches",matchId),{
    realA: realA,
    realB: realB,
    status:"closed"
  });

  const preds = await getDocs(collection(db,"predictions"));

  preds.forEach(async (p)=>{
    const data = p.data();

    if(data.matchId === matchId){

      let score = 0;

      if(data.scoreA === realA && data.scoreB === realB) score = 3;
      else if(
        (data.scoreA > data.scoreB && realA > realB) ||
        (data.scoreA < data.scoreB && realA < realB) ||
        (data.scoreA === data.scoreB && realA === realB)
      ) score = 1;

      await updateDoc(doc(db,"users",data.uid),{
        score: increment(score)
      });
    }
  });

  alert("ปิดผลและคำนวณคะแนนแล้ว");
}