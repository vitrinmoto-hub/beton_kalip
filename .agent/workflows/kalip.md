---
description: Workflow for using DeepSeek Coder 33B via Ollama server. Sends prompts and gets code output.
---

# --------------------------------------
# DeepSeek 33B Q4 Workflow Test Script
# Tek tıkla test + konsol cevabı kalır
# --------------------------------------

$modelURL = "http://127.0.0.1:11434"
$prompt = Read-Host "💬 Test promptunu yaz:"

# JSON body oluştur
$body = @{
    prompt = $prompt
    max_tokens = 1024
    temperature = 0.2
} | ConvertTo-Json

# HTTP request ile modeli çağır
try {
    $response = Invoke-RestMethod -Uri "$modelURL/api/generate" -Method POST -Body $body -ContentType "application/json"
    $output = $response.output_text

    Write-Host "✅ Model cevabı geldi:" -ForegroundColor Green
    Write-Host "------------------------------------"
    Write-Host $output
    Write-Host "------------------------------------"
} catch {
    Write-Host "❌ Model çağrılırken bir hata oluştu: $_" -ForegroundColor Red


# Konsolda pencere kapanmasın
Read-Host -Prompt "Çıkmak için Enter'a basın"
