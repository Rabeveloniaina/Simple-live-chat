const STORE_NAME = 'chat-data';

export const chatStore = {
  /**
   * @returns {{id: number, time:number, m_id: number, text: string}[]}
   */
  getData: () => {
    const data = localStorage.getItem(STORE_NAME)
      ? JSON.parse(localStorage.getItem(STORE_NAME))
      : [];
    return data.sort((a, b) => b.time - a.time);
  },

  sendMessage: (m_id, text) => {
    const data = chatStore.getData();
    data.forEach((k, i) => {
      console.log(k, i);
    });
    const message = {
      id: data.length + 1,
      time: Date.now(),
      m_id,
      text,
    };
    data.push(message);
    localStorage.setItem(STORE_NAME, JSON.stringify(data));
    return message;
  },
};
