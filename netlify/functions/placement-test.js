exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "Method Not Allowed"
      })
    };
  }

  try {
    const payload = JSON.parse(event.body);

    const {
      name,
      phone,
      birthDate,
      cefr,
      ielts,
      writing,
      format
    } = payload;

    if (!name || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Name and phone are required"
        })
      };
    }

    const text = `📊 PLACEMENT TEST RESULT

👤 Name: ${name}
📞 Phone: ${phone}
🎂 Birth date: ${birthDate || "—"}

📈 CEFR: ${cefr || "—"}
🎯 IELTS Equivalent: ${ielts || "—"}
✍️ Writing: ${writing || "—"}

📚 Format: ${format || "—"}`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: text
        })
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram error:", telegramResult);

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Telegram error"
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true
      })
    };

  } catch (error) {
    console.error("Placement test function error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
