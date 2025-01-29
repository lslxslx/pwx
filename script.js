document.addEventListener('DOMContentLoaded', () => {
  const subjectSelect = document.getElementById('subjectSelect');
  const studentNameInput = document.getElementById('studentName');
  const resultDiv = document.getElementById('result');

  let studentData = []; // Të dhënat e studentëve

  // Kur ndryshon lënda
  subjectSelect.addEventListener('change', async () => {
    const subject = subjectSelect.value;

    if (!subject) {
      resultDiv.textContent = "Nëse dëshiron, zgjidh lëndën.";
      studentNameInput.disabled = true;
      return;
    }

    try {
      // Ngarko të dhënat e JSON përkatës
      const response = await fetch(`json/${subject}.json`);
      studentData = await response.json();
      studentNameInput.disabled = false;
    } catch (error) {
      console.error('Gabim gjatë ngarkimit të të dhënave:', error);
      resultDiv.textContent = "Gabim gjatë ngarkimit të të dhënave.";
    }
  });

  // Kur përdoruesi shtyp Enter në fushën e emrit
  studentNameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const name = studentNameInput.value.trim().toLowerCase();

      if (!name) {
        resultDiv.textContent = "Po pra, po emrin si e ke?!";
        return;
      }

      // Filtrimi i të dhënave të studentëve
      const student = studentData.find(student =>
        student["Emri Mbiemri"].toLowerCase() === name
      );

      if (student) {
        // Përpuno datën nga formati JSON
        const [month, day, year] = student["Start time"].split(' ')[0].split('.');
        const formattedDate = `${day}.${month}.${year}`;

        // Llogarit notën
        const totalPoints = student["Total points"];
        const calculatedGrade = calculateGrade(totalPoints);

        resultDiv.innerHTML = `
            <strong>Emri:</strong> ${titleCase(student["Emri Mbiemri"])}<br>
            <strong>Pikët totale:</strong> ${totalPoints} &rarr; <strong>Nota:</strong> ${calculatedGrade}<br>
            <strong>Data:</strong> ${formattedDate}
          `;
      } else {
        resultDiv.textContent = `${studentNameInput.value.trim()}, a ke bërë provim?!`;
      }
    }
  });

  // Funksioni për llogaritjen e notës
  function calculateGrade(totalPoints) {
    const maxPoints = 100;
    return Math.round((totalPoints / maxPoints) * 10);
  }

  // Funksioni për ta kthyer tekstin në Title Case
  function titleCase(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
});  