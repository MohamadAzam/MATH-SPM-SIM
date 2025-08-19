'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Button } from '@material-tailwind/react';
import { Clock, Maximize2, Minimize2 } from 'lucide-react';
import { formatTime } from '@/utils/examHelpers';
import { EXAM_CONFIG } from '@/utils/constants';

interface TimerComponentProps {
  timeRemaining: number;
  onTimeUp: () => void;
  onTimeUpdate: (time: number) => void;
  isActive: boolean;
}

export default function TimerComponent({ 
  timeRemaining, 
  onTimeUp, 
  onTimeUpdate, 
  isActive 
}: TimerComponentProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(timeRemaining);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev - 1;
        onTimeUpdate(newTime);
        
        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp, onTimeUpdate]);

  useEffect(() => {
    setCurrentTime(timeRemaining);
  }, [timeRemaining]);

  const toggleFullScreen = async () => {
    try {
      if (!isFullScreen) {
        await document.documentElement.requestFullscreen();
        setIsFullScreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullScreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const isWarningTime = currentTime <= EXAM_CONFIG.WARNING_TIME;
  const isCriticalTime = currentTime <= 5 * 60; // 5 minutes

  const getTimerColor = () => {
    if (isCriticalTime) return 'text-red-600';
    if (isWarningTime) return 'text-orange-600';
    return 'text-blue-600';
  };

  const getTimerBgColor = () => {
    if (isCriticalTime) return 'bg-red-50 border-red-200';
    if (isWarningTime) return 'bg-orange-50 border-orange-200';
    return 'bg-blue-50 border-blue-200';
  };

  return (
    <Card className={`p-4 ${getTimerBgColor()} border-2 sticky top-4 z-10`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className={`w-6 h-6 ${getTimerColor()}`} />
          <div>
            <Typography variant="small" className="text-gray-600 font-medium">
              Masa Tinggal
            </Typography>
            <Typography variant="h4" className={`font-bold ${getTimerColor()}`}>
              {formatTime(currentTime)}
            </Typography>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isWarningTime && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <Typography variant="small" className="text-red-600 font-medium">
                {isCriticalTime ? 'KRITIKAL!' : 'AMARAN!'}
              </Typography>
            </div>
          )}
          
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Skrin Penuh</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              isCriticalTime 
                ? 'bg-red-500' 
                : isWarningTime 
                ? 'bg-orange-500' 
                : 'bg-blue-500'
            }`}
            style={{
              width: `${(currentTime / EXAM_CONFIG.EXAM_DURATION) * 100}%`
            }}
          ></div>
        </div>
        <Typography variant="small" className="text-gray-500 mt-1 text-center">
          {Math.round((currentTime / EXAM_CONFIG.EXAM_DURATION) * 100)}% masa tinggal
        </Typography>
      </div>
    </Card>
  );
}