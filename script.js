document.addEventListener('DOMContentLoaded', () => {
  const subjectSelect = document.getElementById('subjectSelect');
  const studentCodeInput = document.getElementById('studentCode');
  const resultDiv = document.getElementById('result');

  let studentData = []; // Të dhënat e studentëve

  // Kur ndryshon lënda
  subjectSelect.addEventListener('change', async () => {
    const subject = subjectSelect.value;

    if (!subject) {
      resultDiv.textContent = "Zgjidh lëndën.";
      studentCodeInput.disabled = true;
      return;
    }

    try {
      // Ngarko të dhënat e JSON përkatës
      const response = await fetch(`json/${subject}.json`);
      studentData = await response.json();
      studentCodeInput.disabled = false;
    } catch (error) {
      console.error('Gabim gjatë ngarkimit të të dhënave:', error);
      resultDiv.textContent = "Gabim gjatë ngarkimit të të dhënave.";
    }
  });

  // Kur përdoruesi shtyp Enter në fushën e emrit
  studentCodeInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const code = studentCodeInput.value.trim();

      if (!code) {
        resultDiv.textContent = "Po pra, po kodi cili është?!";
        return;
      }

      // Filtrimi i të dhënave të studentëve
      const student = studentData.find(student => student["Kodi"].toString() === code);

      if (student) {
        // Përpuno datën nga formati JSON
        const [month, day, year] = student["Start time"].split(' ')[0].split('.');
        const formattedDate = `${day}.${month}.${year}`;

        // Llogarit notën
        const totalPoints = student["Total points"];
        const calculatedGrade = calculateGrade(totalPoints);

        resultDiv.innerHTML = `
            <p>Nota: ${calculatedGrade}</p>
            <p>Pikët totale: ${totalPoints}</p>
            <p>Data: ${formattedDate}</p>
          `;
      } else {
        resultDiv.textContent = `Nuk kam të dhëna për këtë kod.`;
      }
    }
  });

  function calculateGrade(totalPoints) {
    const maxPoints = 100;

    // Kontrollo nëse pikët janë më të vogla se 45
    if (totalPoints < 45) {
      return 4;
    }

    // Nëse pikët janë më të mëdha se 44, llogarit notën normale
    return Math.round((totalPoints / maxPoints) * 10);
  }

  // Funksioni për ta kthyer tekstin në Title Case
  function titleCase(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
});  