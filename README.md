# cosm-api
Cosmwasm REST API to query and execute transactions on COSMOS SDK blockchains with Cosmwasm enabled.

# Local Usage
## Install Node Packages
```npm i```

## Run development server
```npm run dev```

## Try random query
```http://localhost:6060/query/juno13a409cc34ttnwaflr0p74et0zx8uvy3805zvh8sugw6eqhjyv42qml8vup/%7B%22balance%22:%7B%22address%22:%22juno197y44w58djquqkpu8v56pgwvm058f6jswm0jec%22%7D%7D```

## Try simulating transaction fees
```http://localhost:6060/simulate/juno1tjrxa5mdrxpfs8eh2sfhh5hggun5xgvquxxjp6rf6dsjzmh0nqvqcayrpf/%7B%22send%22:%7B%7D%7D```