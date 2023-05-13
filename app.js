const API_KEY = process.env.OPENAI_API_KEY
async function fetchData() {
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/.json"
    },
    body: JSON.stringify({
      model: "text.davinci-003",
      prompt: "hello",
      max_tokens: 10
    })
  })
  const data = await response.json()
  console.log(data)
}

fetchData()