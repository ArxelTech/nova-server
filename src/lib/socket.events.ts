export const SOCKET_EVENTS = {
  // EVENTS I LISTEN FOR ON THE SERVER
  PLAY_PAUSE: {
    event: `PLAY_PAUSE`,
    payload: { roomid: 'string' },
  },
  UPDATE_PLAYBACK: {
    event: `UPDATE_PLAYBACK`,
    payload: { id: 'string', playback: 'number' },
  },

  // FRONT END EVENTS TO LISTEN FOR
  GET_MESSAGE: (roomid: string) => ({
    event: `GET_MESSAGE:${roomid}`,
    body: { message: 'message' },
  }),

  PLAY_PAUSE_FE: (roomid: string) => ({
    event: `PLAY_PAUSE:${roomid}`,
    payload: { room: 'room' },
  }),

  UPDATE_PLAYBACK_FE: (roomid: string) => ({
    event: `UPDATE_PLAYBACK:${roomid}`,
    payload: { room: 'room' },
  }),

  NEW_MESSAGE_FE: (roomid: string) => ({
    event: `CHAT_MESSAGE:${roomid}`,
    payload: { roomId: roomid, message: 'Chat' },
  }),
};
