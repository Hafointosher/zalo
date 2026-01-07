@echo off
setlocal enabledelayedexpansion

set SOURCE=C:\Users\Hafointosher\Desktop\n8n-nodes-zalo-user-v3\dist
set OUTPUT=C:\Users\Hafointosher\Desktop\n8n-zalo-deobfuscated

echo ========================================
echo   Deobfuscating with Synchrony
echo ========================================
echo.

REM Credentials
echo [1/16] ZaloUserCredentialsApi.credentials.js
call npx synchrony "%SOURCE%\credentials\ZaloUserCredentialsApi.credentials.js" -o "%OUTPUT%\credentials\ZaloUserCredentialsApi.credentials.js" --rename

echo [2/16] ZaloBotApi.credentials.js
call npx synchrony "%SOURCE%\credentials\ZaloBotApi.credentials.js" -o "%OUTPUT%\credentials\ZaloBotApi.credentials.js" --rename

echo [3/16] ZaloOACredentialsApi.credentials.js
call npx synchrony "%SOURCE%\credentials\ZaloOACredentialsApi.credentials.js" -o "%OUTPUT%\credentials\ZaloOACredentialsApi.credentials.js" --rename

REM ZaloUser nodes
echo [4/16] ZaloUser.node.js
call npx synchrony "%SOURCE%\nodes\ZaloUser\ZaloUser.node.js" -o "%OUTPUT%\nodes\ZaloUser\ZaloUser.node.js" --rename

echo [5/16] ZaloUserInteract.node.js (large file - may take a while)
call npx synchrony "%SOURCE%\nodes\ZaloUser\ZaloUserInteract.node.js" -o "%OUTPUT%\nodes\ZaloUser\ZaloUserInteract.node.js" --rename

echo [6/16] ZaloUserLogin.node.js
call npx synchrony "%SOURCE%\nodes\ZaloUser\ZaloUserLogin.node.js" -o "%OUTPUT%\nodes\ZaloUser\ZaloUserLogin.node.js" --rename

echo [7/16] ZaloManager.node.js
call npx synchrony "%SOURCE%\nodes\ZaloUser\ZaloManager.node.js" -o "%OUTPUT%\nodes\ZaloUser\ZaloManager.node.js" --rename

echo [8/16] ZaloApi.js
call npx synchrony "%SOURCE%\nodes\ZaloUser\ZaloApi.js" -o "%OUTPUT%\nodes\ZaloUser\ZaloApi.js" --rename

echo [9/16] utils.js
call npx synchrony "%SOURCE%\nodes\ZaloUser\utils.js" -o "%OUTPUT%\nodes\ZaloUser\utils.js" --rename

echo [10/16] error.js
call npx synchrony "%SOURCE%\nodes\ZaloUser\error.js" -o "%OUTPUT%\nodes\ZaloUser\error.js" --rename

REM ZaloBot nodes
echo [11/16] ZaloBot.node.js
call npx synchrony "%SOURCE%\nodes\ZaloBot\ZaloBot.node.js" -o "%OUTPUT%\nodes\ZaloBot\ZaloBot.node.js" --rename

echo [12/16] ZaloBotTrigger.node.js
call npx synchrony "%SOURCE%\nodes\ZaloBot\ZaloBotTrigger.node.js" -o "%OUTPUT%\nodes\ZaloBot\ZaloBotTrigger.node.js" --rename

echo [13/16] GenericFunctions.js
call npx synchrony "%SOURCE%\nodes\ZaloBot\GenericFunctions.js" -o "%OUTPUT%\nodes\ZaloBot\GenericFunctions.js" --rename

echo [14/16] IEvent.js
call npx synchrony "%SOURCE%\nodes\ZaloBot\IEvent.js" -o "%OUTPUT%\nodes\ZaloBot\IEvent.js" --rename

REM ZaloOA nodes
echo [15/16] ZaloOA.node.js (largest file - may take a while)
call npx synchrony "%SOURCE%\nodes\ZaloOA\ZaloOA.node.js" -o "%OUTPUT%\nodes\ZaloOA\ZaloOA.node.js" --rename

echo [16/16] ZaloOATrigger.node.js
call npx synchrony "%SOURCE%\nodes\ZaloOA\ZaloOATrigger.node.js" -o "%OUTPUT%\nodes\ZaloOA\ZaloOATrigger.node.js" --rename

echo.
echo ========================================
echo   Deobfuscation Complete!
echo ========================================
