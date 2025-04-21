## Project: Memory Card Game

**Date:** April 21, 2025

**Role:** Software Engineer

**Task 1:** Optimize the card-flip logic for smooth performance.

### Key Changes Made in Code:

1.  **USING `React.memo` for prevents unnecessary card re-renders:**

    ```javascript
    const Card = memo(({ card, handleClick, flipped, matched }) => {
      // Logic part same
    });
    ```

    **USE CASE:** Wrapping the `Card` component with `React.memo` tells React to only re-render this component if its props (`card`, `handleClick`, `flipped`, `matched`) have changed. This prevents unnecessary re-renders when the parent component updates, leading to smoother animations.

2.  **Making Our Instructions (Functions) More Reliable with `useCallback`:**

    ```javascript
    const handleCardClick = useCallback((card) => {
      if (!mouseDisabled && !matchedCards.includes(card.id) && flippedCards.length < 2 && !flippedCards.some((c) => c.id === card.id)) {
        setFlippedCards((prev) => [...prev, card]);
      }
    }, [flippedCards, matchedCards, mouseDisabled]);
    ```

    **USE CASE:** Stabilizes function identities for memoized components. This ensures that the `handleClick` prop passed to the `Card` component only changes when its dependencies (`flippedCards`, `matchedCards`, `mouseDisabled`) change, further optimizing re-renders due to `React.memo`.

3.  **Keeping Our Game Assets Handy:**

    ```javascript
    // Card Images are now outside!
    const cardImages = [ /* ... */ ];
    const matchAudioFiles = [ /* ... */ ];
    const congratsAudio = "/audio/congrats.mp3";
    ```

    **USE CASE:** Avoids recreating static data (card images, audio file paths) on every render of the `MemoryCardGame` component, improving performance.

4.  **Making Card Clicks Smart with `mouseDisabled`:**

    ```javascript
    const handleCardClick = useCallback((card) => {
      if (!mouseDisabled && /* other conditions */) {
        // ... flip card logic ...
      }
    }, [flippedCards, matchedCards, mouseDisabled]);
    ```

    **USE CASE:** Ensures click handling respects the disabled state (`mouseDisabled`), preventing unintended clicks during the card matching delay and improving the user experience by making interactions more predictable.

5.  **Telling Our "Flip Checker" to Watch for Click Blocking:**

    ```javascript
    useEffect(() => {
      if (flippedCards.length === 2) {
        setMouseDisabled(true);
        setTimeout(() => {
          // ... check for match ...
          setMouseDisabled(false);
        }, 1000);
      }
    }, [flippedCards, audioIndex, sfxVolume, setMouseDisabled]);
    ```

    **USE CASE:** Ensures the flip logic respects the disabled state (`mouseDisabled`), preventing further card flips while the game checks for a match or mismatch, leading to a more controlled game flow.

6.  **Ensuring Our Game Setup and Sounds are Stable:**

    ```javascript
    useEffect(() => {
      handleNewGame();
      // ... audio setup ...
    }, [handleNewGame, bgVolume, musicStarted]);
    ```

    **USE CASE:** Stabilizes the initial game setup and audio playback. By including `handleNewGame`, `bgVolume`, and `musicStarted` as dependencies, the game and background music are correctly initialized or reset when these values change. Using `useCallback` for `handleNewGame` further optimizes this.

7.  **Keeping Track of Who's Playing (the `userID`):**

    ```javascript
    const handleSaveNewGame = useCallback(async () => {
      if (!userID) return;
      // ... save logic ...
    }, [userID, failedAttempts, timer]);

    useEffect(() => {
      if (matchedCards.length === cards.length) {
        // ... save logic ...
      }
    }, [matchedCards, cards.length, navigate, sfxVolume, failedAttempts, timer, userID]);
    ```

    **USE CASE:** Ensures game saving is tied to the correct user by checking for the `userID` before attempting to save game data, both when explicitly triggering a new game save and upon game completion.

**Important Note on Logic:**

I have noticed that in the `handleCardClick` function, I check `flippedCards.length < 2`. While the `useEffect` hook also triggers when `flippedCards.length === 2`, after examination, I understood that this initial check in `handleCardClick` is intentional and necessary. It acts as a gatekeeper, preventing the user from rapidly clicking more than two cards before the game logic has a chance to process the first two. Removing this check could lead to unexpected behavior and a less intuitive user experience, as the `flippedCards` array might temporarily hold more than two cards, potentially breaking the matching logic designed for pairs. Therefore, this "dual check" is not redundant but rather a safeguard for the game's intended interaction flow. Hence, I am not changing it!

**Complete Code After Optimization:** (frontend/src/memoryCardGame/MemoryCardGame.jsx)

```javascript
// [Rest of the code provided in the original text]