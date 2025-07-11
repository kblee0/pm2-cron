# pm2-cron

> PM2 프로세스를 cron 스케줄에 따라 자동으로 재시작하는 PM2 플러그인

`pm2-cron-restart`는 [`node-schedule`](https://www.npmjs.com/package/node-schedule)을 사용하여, 설정한 cron 표현식에 따라 지정된 PM2 프로세스를 자동으로 주기적으로 `restart`합니다.

## 설치 방법

### GitHub에서 설치
```bash
pm2 install https://github.com/kblee0/pm2-cron.git
```

## 설정 방법

설정은 `pm2 set` 명령어를 사용 합니다.  
형식:  
```bash
pm2 set pm2-cron:{{프로세스명}} "스케쥴"
```

### 예시
```bash
pm2 set pm2-cron:worker1 '*/10 * * * * *'
pm2 set pm2-cron:worker2 '0 */5 * * * *'
```

| 프로세스명 | cron 표현식         | 의미                 |
|------------|----------------------|----------------------|
| `worker1`  | `*/10 * * * * *`     | 매 10초마다          |
| `worker2`  | `0 */5 * * * *`      | 매 5분 정각마다      |

cron 표현식은 [node-schedule 문법](https://github.com/node-schedule/node-schedule#cron-style-scheduling)을 따릅니다.

## 사용 흐름

1. PM2 프로세스를 실행합니다.
```bash
pm2 start app.js --name worker1
pm2 stop worker1
pm2 start app.js --name worker2
pm2 stop worker2
```

2. 플러그인을 설치합니다.
```bash
pm2 install https://github.com/kblee0/pm2-cron.git
```

3. 스케줄을 등록합니다.
```bash
pm2 set pm2-cron:worker1 '*/30 * * * * *'
pm2 set pm2-cron:worker2 '*/1 * * * *'
```

4. 로그를 확인합니다.
```bash
pm2 logs pm2-cron
```

## 제거

```bash
pm2 uninstall pm2-cron
```

## 라이선스

MIT License © 2025 [kblee0]
