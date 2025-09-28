<CardTitle className="flex items-center justify-between">
            <span>Control Center</span>
            <div className="flex items-center space-x-2">
                <Label htmlFor="auto-optimize" className="text-sm">
                  {autoOptimizeEnabled
                    ? (tracking ? "Stop Tracking" : "Auto-Optimize On")
                    : (tracking ? "Tracking On" : "Start Live Tracking")}
                </Label>
              <Switch
                id="auto-optimize"
                checked={autoOptimizeEnabled}
                onCheckedChange={onAutoOptimize}
              />
            </div>
          </CardTitle>