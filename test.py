import requests

url = "http://localhost:10002/solve"
payload = {"random_val": "abc123"}

res = requests.post(url, json=payload)
print("Status:", res.status_code)
print("Response:")
print(res.json())
