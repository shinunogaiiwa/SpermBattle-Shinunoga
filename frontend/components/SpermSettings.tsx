'use client';

import React from 'react';
import { Settings, Eye, EyeOff, Zap, Users } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface SpermSettingsProps {
  visible: boolean;
  density: number;
  speed: number;
  onVisibilityChange: (visible: boolean) => void;
  onDensityChange: (density: number) => void;
  onSpeedChange: (speed: number) => void;
}

export function SpermSettings({
  visible,
  density,
  speed,
  onVisibilityChange,
  onDensityChange,
  onSpeedChange,
}: SpermSettingsProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full border-2 border-purple-500/30 bg-black/80 backdrop-blur-sm hover:bg-purple-900/50 hover:border-purple-400/50 shadow-lg shadow-purple-500/20 transition-all duration-300"
        >
          <Settings className="h-6 w-6 text-purple-400 animate-pulse" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-black/95 border-l-2 border-purple-500/30 backdrop-blur-md">
        <SheetHeader>
          <SheetTitle className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
            <Settings className="h-6 w-6 text-purple-400" />
            Background Settings
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Customize the floating sperm background
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {visible ? (
                  <Eye className="h-5 w-5 text-green-400" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                )}
                <Label htmlFor="visibility" className="text-base">
                  Visibility
                </Label>
              </div>
              <Switch
                id="visibility"
                checked={visible}
                onCheckedChange={(checked) => onVisibilityChange(Boolean(checked))}
              />
            </div>
            <p className="text-sm text-gray-500 ml-8">
              {visible ? 'Background is visible' : 'Background is hidden'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-400" />
              <Label htmlFor="density" className="text-base">
                Density
              </Label>
              <span className="ml-auto text-sm text-purple-400 font-mono">
                {density}
              </span>
            </div>
            <Slider
              id="density"
              min={1}
              max={50}
              step={1}
              value={[density]}
              onValueChange={(values) => onDensityChange(values[0] ?? density)}
              className="w-full"
              disabled={!visible}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Minimal</span>
              <span>Moderate</span>
              <span>Swarm</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-yellow-400" />
              <Label htmlFor="speed" className="text-base">
                Mobility
              </Label>
              <span className="ml-auto text-sm text-purple-400 font-mono">
                {speed.toFixed(1)}x
              </span>
            </div>
            <Slider
              id="speed"
              min={0.1}
              max={3}
              step={0.1}
              value={[speed]}
              onValueChange={(values) => onSpeedChange(values[0] ?? speed)}
              className="w-full"
              disabled={!visible}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Lazy</span>
              <span>Normal</span>
              <span>Turbo</span>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
            <p className="text-xs text-gray-400 leading-relaxed">
              💡 <span className="text-purple-300">Pro tip:</span> Lower density
              and speed for a subtle background, or crank them up for maximum
              chaos!
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm text-gray-400">Quick Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onVisibilityChange(true);
                  onDensityChange(5);
                  onSpeedChange(0.5);
                }}
                className="bg-black/50 border-purple-500/30 hover:bg-purple-900/30"
              >
                Minimal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onVisibilityChange(true);
                  onDensityChange(15);
                  onSpeedChange(1);
                }}
                className="bg-black/50 border-purple-500/30 hover:bg-purple-900/30"
              >
                Default
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onVisibilityChange(true);
                  onDensityChange(30);
                  onSpeedChange(2);
                }}
                className="bg-black/50 border-purple-500/30 hover:bg-purple-900/30"
              >
                Intense
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onVisibilityChange(false);
                }}
                className="bg-black/50 border-purple-500/30 hover:bg-purple-900/30"
              >
                Off
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

