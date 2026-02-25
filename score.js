async function calculateScores(matchId) {

  const preds = await getDocs(collection(db, "predictions"));

  preds.forEach(async (docu) => {
    const data = docu.data();

    if(data.matchId === matchId){

      let score = 0;

      if(data.scoreA === realA && data.scoreB === realB) score = 3;
      else if(
        (data.scoreA > data.scoreB && realA > realB) ||
        (data.scoreA < data.scoreB && realA < realB) ||
        (data.scoreA === data.scoreB && realA === realB)
      ) score = 1;

      const userRef = doc(db, "users", data.uid);
      await updateDoc(userRef, {
        score: increment(score)
      });
    }
  });
}