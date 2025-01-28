document.addEventListener('DOMContentLoaded', () => {
  const subjectSelect = document.getElementById('subjectSelect');
  const studentNameInput = document.getElementById('studentName');
  const resultDiv = document.getElementById('result');

  let studentData = []; // Të dhënat e studentëve

  // Kur ndryshon lënda
  subjectSelect.addEventListener('change', async () => {
    const subject = subjectSelect.value;

    if (!subject) {
      resultDiv.textContent = "Të lutem, zgjidh lëndën.";
      studentNameInput.disabled = true;
      return;
    }

    studentNameInput.disabled = false;
    resultDiv.textContent = "Po ngarkoj të dhënat...";

    try {
      const token = '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'; // Vendosni token-in tuaj këtu
      const response = await fetch(`https://api.github.com/repos/USERNAME/REPO_NAME/contents/data/${subject}.json`, {
        method: 'GET',
        headers: {
          'Authorization': `token ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Gabim gjatë ngarkimit të të dhënave');
      }

      const data = await response.json();
      const decodedData = atob(data.content); // Dekodimi i skedarit nga base64

      studentData = JSON.parse(decodedData); // Shndërro të dhënat në objekt JSON
      resultDiv.textContent = "Të dhënat u ngarkuan. Tani shkruaj emrin tënd.";
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
        const [day, month, year] = student["Start time"].split(' ')[0].split('.');
        const formattedDate = `${day}.${month}.${year}`;

        // Llogarit notën
        const totalPoints = student["Total points"];
        const calculatedGrade = calculateGrade(totalPoints);

        resultDiv.innerHTML = `
            <strong>Emri:</strong> ${titleCase(student["Emri Mbiemri"])}<br>
            <strong>Nota:</strong> ${calculatedGrade}<br>
            <strong>Pikët totale:</strong> ${totalPoints}<br>
            <strong>Data:</strong> ${formattedDate}
          `;
      } else {
        resultDiv.textContent = `${name}, a ke bërë provim?!`;
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