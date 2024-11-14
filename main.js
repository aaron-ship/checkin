const glados = async () => {
  const cookie = process.env.GLADOS
  if (!cookie) return
  try {
    const headers = {
      'cookie': cookie,
      // 'referer': 'https://glados.rocks/console/checkin',
      'user-agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
    }
    const checkin = await fetch('https://glados.rocks/api/user/checkin', {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: '{"token":"glados.one"}',
    }).then((r) => r.json())
    const status = await fetch('https://glados.rocks/api/user/status', {
      method: 'GET',
      headers,
    }).then((r) => r.json())
    return [
      'Checkin OK',
      `balance ${checkin.list[0].balance}`
      `${checkin.message}`,
      `Left Days ${Number(status.data.leftDays)}`,
    ]
  } catch (error) {
    return [
      'Checkin Error',
      `${error}`,
      `<${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}>`,
    ]
  }
}

const notify = async (contents) => {
  // const token = process.env.NOTIFY
  // if (!token || !contents) return
  await fetch(`https://wxpusher.zjiecode.com/api/send/message`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      "appToken":"AT_affwX36KzSXVZOmJQx7kDGPOPtcD8ekd",
      "content":contents.join('<br>'),
      "summary":"glados签到成功",
      "contentType":1,
      "uids":[
          "UID_wioyV7XbT6nedayAkSkNyexMF89N"
      ],
      "verifyPay":false, 
      "verifyPayType":0 
    }),
  })
}

const main = async () => {
  await notify(await glados())
}

main()
