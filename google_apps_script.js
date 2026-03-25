/**
 * Código para o Google Apps Script para registrar as notas da atividade.
 * Instruções:
 * 1. Abra sua planilha Google Sheets com o ID: 1F1qUYkW9--r8U2eCHvOpruZue-HdQRh9T5HroiE5Rws
 * 2. Vá em Extensões > Apps Script.
 * 3. Apague o código que estiver lá e cole este.
 * 4. Clique em "Implantar" > "Nova implantação".
 * 5. Selecione o tipo "App da Web".
 * 6. Em "Quem pode acessar", escolha "Qualquer pessoa".
 * 7. Copie o URL gerado e atualize no index.html se for necessário.
 */

function doPost(e) {
  try {
    // Captura o conteúdo do POST de forma segura
    var contents = e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(contents);
    
    var ss = SpreadsheetApp.openById('1F1qUYkW9--r8U2eCHvOpruZue-HdQRh9T5HroiE5Rws');
    var turmaRaw = (data.turma || "").trim();
    
    // Tenta encontrar a aba pelo nome exato enviado
    var sheet = ss.getSheetByName(turmaRaw);
    
    // Fallback: se não encontrar, tenta os nomes conhecidos (8º Ano ou 8ªSérie)
    if (!sheet) {
      if (turmaRaw.includes("A")) {
        sheet = ss.getSheetByName("8ªSérie A") || ss.getSheetByName("8º Ano A");
      } else if (turmaRaw.includes("B")) {
        sheet = ss.getSheetByName("8ªSérie B") || ss.getSheetByName("8º Ano B");
      }
    }
    
    if (!sheet) {
      return ContentService.createTextOutput("Erro: Aba para a turma '" + turmaRaw + "' não foi encontrada na planilha.").setMimeType(ContentService.MimeType.TEXT);
    }
    
    var nome = (data.nome || "").trim();
    var nota = data.nota;
    var sheetNameActual = sheet.getName();
    
    // Determinar a coluna de notas com base no nome real da aba encontrada:
    // "8ªSérie A" ou "8º Ano A" -> Coluna AA (27)
    // "8ªSérie B" ou "8º Ano B" -> Coluna Y (25)
    var colNota = 24; // Padrão
    if (sheetNameActual.includes("A")) {
      colNota = 27;
    } else if (sheetNameActual.includes("B")) {
      colNota = 25;
    }
    
    // Localizar o nome do aluno na coluna B (começando da linha 5)
    var lastRow = Math.max(sheet.getLastRow(), 5);
    var dataRange = sheet.getRange("B5:B" + lastRow).getValues();
    var rowIndex = -1;
    
    var nomeBusca = nome.toLowerCase();
    for (var i = 0; i < dataRange.length; i++) {
      var valorCelula = (dataRange[i][0] || "").toString().toLowerCase().trim();
      if (valorCelula === nomeBusca) {
        rowIndex = i + 5; 
        break;
      }
    }
    
    if (rowIndex !== -1) {
      // Grava a nota na coluna mapeada
      sheet.getRange(rowIndex, colNota).setValue(nota);
      return ContentService.createTextOutput("Sucesso: Nota registrada para " + nome).setMimeType(ContentService.MimeType.TEXT);
    } else {
      // Se não achar o nome, adiciona no final da lista
      var nextRow = sheet.getLastRow() + 1;
      if (nextRow < 5) nextRow = 5;
      sheet.getRange(nextRow, 2).setValue(nome); 
      sheet.getRange(nextRow, colNota).setValue(nota);
      return ContentService.createTextOutput("Sucesso: Novo aluno adicionado e nota registrada.").setMimeType(ContentService.MimeType.TEXT);
    }
    
  } catch (err) {
    return ContentService.createTextOutput("Erro no Script: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}

