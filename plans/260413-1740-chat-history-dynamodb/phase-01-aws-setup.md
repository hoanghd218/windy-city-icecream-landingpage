# Phase 1 — AWS Setup (DynamoDB + IAM)

**Priority:** P1 | **Status:** pending | **Effort:** 1h

## Overview

Tạo DynamoDB table + IAM user với least privilege, add env vars vào Vercel.

## 1.1 Create DynamoDB table

**AWS Console** → DynamoDB → **us-east-1** → **Create table**

- Table name: `windy-chat-logs`
- Partition key: `sessionId` (String)
- Sort key: `ts` (String)
- Capacity mode: **On-demand** (pay per request — phù hợp seasonal)
- Encryption: AWS-owned key (default)

**After creation → Indexes tab → Create index:**
- GSI name: `by-date-index`
- Partition key: `dateKey` (String)
- Sort key: `ts` (String)
- Projection: All
- Capacity: On-demand

## 1.2 Create IAM user

**IAM → Users → Create user**

- Username: `windy-chatbot-app`
- Access type: Programmatic (access keys, no console)

**Inline policy (least privilege):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ChatLogAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:Query",
        "dynamodb:GetItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/windy-chat-logs",
        "arn:aws:dynamodb:us-east-1:*:table/windy-chat-logs/index/*"
      ]
    }
  ]
}
```

**Save** → Download CSV with `Access Key ID` + `Secret Access Key`.

## 1.3 Generate secrets

```bash
# Admin password (20+ chars high entropy)
openssl rand -base64 24

# IP hash salt
openssl rand -hex 32
```

## 1.4 Add env vars to Vercel

```bash
cd fe
vercel env add AWS_REGION production --value "us-east-1" --yes
vercel env add AWS_ACCESS_KEY_ID production --value "AKIA..." --yes
vercel env add AWS_SECRET_ACCESS_KEY production --value "..." --yes
vercel env add DYNAMODB_CHAT_TABLE production --value "windy-chat-logs" --yes
vercel env add ADMIN_PASSWORD production --value "<generated>" --yes
vercel env add IP_HASH_SALT production --value "<generated>" --yes

# Also add to development
vercel env add AWS_REGION development --value "us-east-1" --yes
# ... repeat for all
```

Also update local `.env.local` với cùng values.

## 1.5 Smoke test

```bash
aws dynamodb describe-table --table-name windy-chat-logs --region us-east-1 \
  --profile <profile>
```

Or from Node:
```js
import { DynamoDBClient, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
const c = new DynamoDBClient({ region: "us-east-1" });
const r = await c.send(new DescribeTableCommand({ TableName: "windy-chat-logs" }));
console.log(r.Table.TableStatus);
```

## Success Criteria

- [ ] Table `windy-chat-logs` exists, status `ACTIVE`
- [ ] GSI `by-date-index` created, status `ACTIVE`
- [ ] IAM user has ONLY PutItem/Query/GetItem permissions
- [ ] All env vars present in Vercel (production + development)
- [ ] `.env.local` updated locally

## Todo

- [ ] Create DynamoDB table
- [ ] Create GSI
- [ ] Create IAM user + policy
- [ ] Download access keys
- [ ] Generate admin password + salt
- [ ] Add env vars to Vercel + .env.local
- [ ] Smoke test connection
