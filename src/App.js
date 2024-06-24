import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';

const ColorGuessingGame = () => {
  const [gameState, setGameState] = useState({
    currentRound: 0,
    totalRounds: 5,
    currentColor: '',
    score: 0,
    roundResults: [],
  });
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (gameState.currentRound < gameState.totalRounds) {
      startNewRound();
    }
  }, [gameState.currentRound]);

  const startNewRound = () => {
    const newColor = generateRandomColor();
    setGameState(prev => ({ ...prev, currentColor: newColor }));
  };

  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const calculateColorDistance = (color1, color2) => {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
  };

  const handleSubmit = () => {
    const distance = calculateColorDistance(gameState.currentColor, selectedColor);
    const roundScore = Math.max(0, 100 - Math.floor(distance));

    const roundResult = {
      round: gameState.currentRound + 1,
      actualColor: gameState.currentColor,
      guessedColor: selectedColor,
      score: roundScore,
    };

    setGameState(prev => ({
      ...prev,
      currentRound: prev.currentRound + 1,
      score: prev.score + roundScore,
      roundResults: [...prev.roundResults, roundResult],
    }));
  };

  const handleCopyToClipboard = () => {
    const shareText = `I scored ${gameState.score} points in the Color Guessing Game! Can you beat my score? 🎨🔍`;
    const shareUrl = window.location.href; // Assuming the game is hosted on a webpage
    const fullText = `${shareText}\n\n${shareUrl}`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const handlePlayAgain = () => {
    setGameState({
      currentRound: 0,
      totalRounds: 5,
      currentColor: '',
      score: 0,
      roundResults: [],
    });
    setSelectedColor('#000000');
  };

  const RoundResult = ({ result }) => (
    <div className="mb-2 p-2 border rounded">
      <p>Round {result.round}: Score {result.score}</p>
      <div className="flex items-center">
        <span className="mr-2">Actual:</span>
        <div style={{backgroundColor: result.actualColor}} className="w-6 h-6 mr-2"></div>
        <span className="font-mono">{result.actualColor}</span>
      </div>
      <div className="flex items-center">
        <span className="mr-2">Guessed:</span>
        <div style={{backgroundColor: result.guessedColor}} className="w-6 h-6 mr-2"></div>
        <span className="font-mono">{result.guessedColor}</span>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Color Guessing Game</h1>
      {gameState.currentRound < gameState.totalRounds ? (
        <div>
          <p className="mb-2">Round {gameState.currentRound + 1} of {gameState.totalRounds}</p>
          <p className="mb-4">Try to guess this color: <span className="font-mono">{gameState.currentColor}</span></p>
          <div className="mb-4">
            <input 
              type="color" 
              value={selectedColor} 
              onChange={handleColorChange}
              className="w-full h-12 cursor-pointer"
            />
          </div>
          <button 
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Submit Guess
          </button>
          {gameState.roundResults.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-2">Previous Rounds:</h2>
              {gameState.roundResults.map((result, index) => (
                <RoundResult key={index} result={result} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-2">Game Over!</h2>
          <p className="text-lg mb-4">Your final score: {gameState.score}</p>
          <button 
            onClick={handleCopyToClipboard}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 flex items-center justify-center w-full"
          >
            <Copy className="mr-2" size={20} /> {copied ? 'Copied!' : 'Copy Score to Clipboard'}
          </button>
          <button 
            onClick={handlePlayAgain}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full"
          >
            Play Again
          </button>
          <h3 className="text-lg font-bold mb-2">Round Results:</h3>
          {gameState.roundResults.map((result, index) => (
            <RoundResult key={index} result={result} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorGuessingGame;