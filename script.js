document.getElementById('promptForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // 入力値の取得とサニタイズ（改行除去・前後空白トリム）
    const languageRaw = document.getElementById('language').value.replace(/[\r\n]/g, '').trim();
    const fieldStudyRaw = document.getElementById('Field_Study').value.replace(/[\r\n]/g, '').trim();
    const timeVal = parseInt(document.getElementById('time').value, 10);
    const scaleVal = parseInt(document.getElementById('scale').value, 10);

    // 数値入力値の強固なバリデーション（改ざん・範囲外入力の防止）
    if (isNaN(timeVal) || timeVal < 15 || timeVal > 60) {
        alert('解答時間の目安は 15 から 60 の間の数値で指定してください。');
        return;
    }

    if (isNaN(scaleVal) || scaleVal < 60 || scaleVal > 240) {
        alert('想定の行数は 60 から 240 の間の数値で指定してください。');
        return;
    }

    if (!languageRaw) {
        alert('使用言語を入力してください。');
        return;
    }

    // 学習分野（任意入力）の条件分岐
    const fieldStudyLine = fieldStudyRaw !== ''
        ? `・学習分野: "${fieldStudyRaw}"\n`
        : '';

    // カスタム指示（プロンプト）文章の生成
    const promptText = `[課題を作成して] というキーワードが来たときのみ
以下の条件を満たした、ミニマム実装の課題を作成してください。
・言語: "${languageRaw}"
${fieldStudyLine}・難易度: ${timeVal}分程度で解けるレベル
・コード規模: ${scaleVal}行程度で納まるミニマム実装
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

    // 結果を出力エリアにセット (textarea.value はテキストとして扱われるため自動的に安全)
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
