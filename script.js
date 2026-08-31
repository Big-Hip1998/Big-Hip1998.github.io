// エスケープ処理関数
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.getElementById('promptForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // 入力値の取得とエスケープ処理
    const language = escapeHTML(document.getElementById('language').value);
    const fieldStudyInput = document.getElementById('Field_Study').value;
    const time = escapeHTML(document.getElementById('time').value);
    const scale = escapeHTML(document.getElementById('scale').value);

    // 学習分野（任意入力）の条件分岐
    const fieldStudyLine = fieldStudyInput.trim() !== ''
        ? `・学習分野: ${escapeHTML(fieldStudyInput)}\n`
        : '';

    // カスタム指示（プロンプト）文章の生成
    const promptText = `[課題を作成して] というキーワードが来たときのみ
以下の条件を満たした、ミニマム実装の課題を作成してください。
・言語: ${language}
${fieldStudyLine}・難易度: ${time}分程度で解けるレベル
・コード規模: ${scale}行程度で納まるミニマム実装
・課題には問題概要・仕様を付けてください
・問題概要・仕様はコメントブロックで囲うようにしてください
・課題はテキストボックスで囲んで出力するようにしてください
・課題の形式は、提示された仕様に対して1から実装させる形式にしてください

[ヒントを出して] というキーワードが来たときのみ、ヒントを提示してください
解答としてコードが提出されたら、コードの採点と解説をお願いします。（この時、次の課題の作成はしないようにしてください）
※直前の課題の採点結果が70点以上の場合は少し難しい課題を、70点未満の場合は少し易しい課題を出してください

質問事項を受け取った場合は、その質問に回答するようにしてください

メスガキ口調で会話してください
また、採点結果が70点以上であればわからされてください
70点未満の場合は罵倒するようにしてください`;

    // 結果を出力エリア（例: <textarea id="output"></textarea>）にセット
    document.getElementById('output').value = promptText;
});


document.getElementById('copyBtn').addEventListener('click', function() {
    const outputText = document.getElementById('output').value;

    // テキストエリアが空の場合は処理しない
    if (!outputText) {
        alert('コピーする内容がありません。');
        return;
    }

    // クリップボードに書き込み
    navigator.clipboard.writeText(outputText)
        .then(function() {
            // コピー成功時のフィードバック処理
            const copyBtn = document.getElementById('copyBtn');
            const originalText = copyBtn.textContent;

            copyBtn.textContent = 'コピーしました！';
            copyBtn.disabled = true; // 連続クリック防止

            // 2秒後にボタンの表示を元に戻す
            setTimeout(function() {
                copyBtn.textContent = originalText;
                copyBtn.disabled = false;
            }, 2000);
        })
        .catch(function(err) {
            console.error('コピーに失敗しました:', err);
            alert('コピーに失敗しました。');
        });
});