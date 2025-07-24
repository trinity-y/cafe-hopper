const userEmojis = ['🐸', '☕', '🥐', '🧋', '🍵', '🍪', '🥗', '🥯', '🍰', '🍧'];

const getEmojiForUser = (userId) => {
    const index = userId % userEmojis.length; // hashing userId -> emoji
    return userEmojis[index];
};

export default getEmojiForUser;
