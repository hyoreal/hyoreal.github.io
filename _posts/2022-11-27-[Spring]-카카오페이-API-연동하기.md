---

layout: post

title: "[Spring] 카카오페이 API 연동하기 "

comments: true

categories: [Spring]

tags: [Spring, KakaoPay, API]

---

### <span style='color: #2D3748; background-color: #ffdce0'>카카오페이 API 이해하기</span>

- 결제 프로세스

  - 요청 1 : 백엔드 서버 단에서 결제 요청 상세 정보를 카카오페이 서버에 전달
  - 카카오페이 서버에서 정보를 받아 사용자 인증 
  - 요청 2 : 백엔드 서버 단에서 사용자 인증 후 결제 승인 상세 정보를 카카오페이 서버에 전달
  - 카카오페이 서버에서 최종 결제 처리 완료
  
- cors(Cross-Origin Resource Sharing)

  - 돈 관련 API는 cors를 닫아놓음
  
    - 클라이언트에서 직접 요청하게되면 동일 서버가 아닐 경우 cors 에러 발생
  
- 카카오페이 API 연동 시 cors 우회 방법 

![](https://velog.velcdn.com/images/hyoreal51/post/a4882e1f-bc62-4a91-9756-9abbe44a4f6c/image.png)

- RestTemplate
  
  - http 통신에 유용한 Spring 제공 Template 
  - 응답으로 받은 json 객체를 java 객체로 변환해줌(postFroObject)

- 참고
- https://evan-moon.github.io/2020/05/21/about-cors/
  
### <span style='color: #2D3748; background-color: #ffdce0'>카카오페이 API 단건 결제 구현</span>

![](https://velog.velcdn.com/images/hyoreal51/post/6c3aed1c-c246-41fc-8e99-203fbc0dffbd/image.png)

- 결제 요청 Request

  - Post 메서드로 https://kapi.kakao.com/v1/payment/approve 주소로 권한과 Content-Type을 보내라는 의미
  - admin_key 위치
    - 내 애플리케이션 → 애플리케이션 클릭 → 앱 키 4번째 줄 위치

- 결제 요청 Request Parameter

  - 결제 요청 시 카카오페이 측 에서 요구하는 상세 정보
  - https://developers.kakao.com/docs/latest/ko/kakaopay/single-payment#prepare-request
  
- 결제 요청 Response

  - 결제 요청 시 카카오페이 서버에서 응답 Dto
  - https://developers.kakao.com/docs/latest/ko/kakaopay/single-payment#prepare-response
  
- dto 구현

```java
/**
* 
* 결제 요청 시 카카오에게 받음
*/
@Getter
@Setter
@ToString
public class KakaoReadyResponse {

    private String tid; // 결제 고유 번호
    private String next_redirect_mobile_url; // 모바일 웹일 경우 받는 결제페이지 url
    private String next_redirect_pc_url; // pc 웹일 경우 받는 결제 페이지
    private String created_at;
}
```

- 앱 웹을 목표로 개발하고 있기에 PC 환경 url과 모바일 웹 환경 url을 모두 응답 dto에 추가하였다.

- Service 구현

```java
@Service
@RequiredArgsConstructor
@Transactional
public class KakaoPayService {

    static final String cid = "TC0ONETIME"; // 가맹점 테스트 코드
    static final String admin_Key = "${ADMIN_KEY}"; // 공개 조심! 본인 애플리케이션의 어드민 키를 넣어주세요
    private KakaoReadyResponse kakaoReady;
    
    public KakaoReadyResponse kakaoPayReady() {

         // 카카오페이 요청 양식
        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        parameters.add("cid", cid);
        parameters.add("partner_order_id", "가맹점 주문 번호");
        parameters.add("partner_user_id", "가맹점 회원 ID");
        parameters.add("item_name", "상품명");
        parameters.add("quantity", "주문 수량");
        parameters.add("total_amount", "총 금액");
        parameters.add("vat_amount", "부가세");
        parameters.add("tax_free_amount", "상품 비과세 금액");
        parameters.add("approval_url", "http://localhost:8080/payment/success"); // 성공 시 redirect url
        parameters.add("cancel_url", "http://localhost:8080/payment/cancel"); // 취소 시 redirect url
        parameters.add("fail_url", "http://localhost:8080/payment/fail"); // 실패 시 redirect url
        
        // 파라미터, 헤더
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(parameters, this.getHeaders());
        
        // 외부에 보낼 url
        RestTemplate restTemplate = new RestTemplate();

        kakaoReady = restTemplate.postForObject(
                "https://kapi.kakao.com/v1/payment/ready",
                requestEntity,
                KakaoReadyResponse.class);
                
        return kakaoReady;
    }
    
    /**
     * 카카오 요구 헤더값
     */
    private HttpHeaders getHeaders() {
        HttpHeaders httpHeaders = new HttpHeaders();

        String auth = "KakaoAK " + admin_Key;

        httpHeaders.set("Authorization", auth);
        httpHeaders.set("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        return httpHeaders;
    }
}
```

- controller 구현

```java
@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class KakaoPayController {

    private final KakaoPayService kakaoPayService;
    
    /**
     * 결제요청
     */
    @PostMapping("/ready")
    public ResponseEntity readyToKakaoPay() {

        return kakaoPayService.kakaoPayReady();
    }

    /**
     * 결제 진행 중 취소
     */
    @GetMapping("/cancel")
    public void cancel() {

        throw new BusinessLogicException(ExceptionCode.PAY_CANCEL);
    }

    /**
     * 결제 실패
     */
    @GetMapping("/fail")
    public void fail() {

        throw new BusinessLogicException(ExceptionCode.PAY_FAILED);
    }
}
```

- 결제 승인 Request

![](https://velog.velcdn.com/images/hyoreal51/post/a4cbd432-9efd-43a7-b38f-4dc290044355/image.png)

- 결제 승인 Request Parameter

  - 결제 승인 시 카카오페이 측에서 요청하는 상세 정보
  - https://developers.kakao.com/docs/latest/ko/kakaopay/single-payment#approve-request
  
- 결제 요청 Response

  - 결제 승인 시 카카오페이 서버에서 응답 Dto
  - https://developers.kakao.com/docs/latest/ko/kakaopay/single-payment#approve-response
  
- dto 구현

```java
/**
* 결제 승인 요청 시 사용
*/
@Getter
@Setter
@ToString
public class KakaoApproveResponse {

    private String aid; // 요청 고유 번호
    private String tid; // 결제 고유 번호
    private String cid; // 가맹점 코드
    private String sid; // 정기결제용 ID
    private String partner_order_id; // 가맹점 주문 번호
    private String partner_user_id; // 가맹점 회원 id
    private String payment_method_type; // 결제 수단
    private Amount amount; // 결제 금액 정보
    private String item_name; // 상품명
    private String item_code; // 상품 코드
    private int quantity; // 상품 수량
    private String created_at; // 결제 요청 시간
    private String approved_at; // 결제 승인 시간
    private String payload; // 결제 승인 요청에 대해 저장 값, 요청 시 전달 내용
}
```

```java
/**
* 결제 금액 정보
*/
@Getter
@Setter
@ToString
public class Amount {

    private int total; // 총 결제 금액
    private int tax_free; // 비과세 금액
    private int tax; // 부가세 금액
    private int point; // 사용한 포인트
    private int discount; // 할인금액
    private int green_deposit; // 컵 보증금
}
```

- Service 구현

```java
@Service
@RequiredArgsConstructor
@Transactional
public class KakaoPayService {

    static final String cid = "TC0ONETIME"; // 가맹점 테스트 코드
    static final String admin_Key = "${ADMIN_KEY}"; // 공개 조심! 본인 애플리케이션의 어드민 키를 넣어주세요
    private KakaoReadyResponse kakaoReady;
    
    public KakaoReadyResponse kakaoPayReady() {
    
    ...
    
    }
    
    /**
     * 결제 완료 승인
     */
    public KakaoApproveResponse ApproveResponse(String pgToken) {
    
        // 카카오 요청
        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        parameters.add("cid", cid);
        parameters.add("tid", kakaoReady.getTid());
        parameters.add("partner_order_id", "가맹점 주문 번호");
        parameters.add("partner_user_id", "가맹점 회원 ID");
        parameters.add("pg_token", pgToken);

        // 파라미터, 헤더
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(parameters, this.getHeaders());
        
        // 외부에 보낼 url
        RestTemplate restTemplate = new RestTemplate();
        
        KakaoApproveResponse approveResponse = restTemplate.postForObject(
                "https://kapi.kakao.com/v1/payment/approve",
                requestEntity,
                KakaoApproveResponse.class);
                
        return approveResponse;
    }
    
    private HttpHeaders getHeaders() {
    
    ...
    
    }
}
```

- Controller 구현

```java
@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class KakaoPayController {

    private final KakaoPayService kakaoPayService;
    
    /**
     * 결제요청
     */
    @PostMapping("/ready")
    public KakaoReadyResponse readyToKakaoPay() {

        return kakaoPayService.kakaoPayReady();
    }
    
    /**
     * 결제 성공
     */
    @GetMapping("/success")
    public ResponseEntity afterPayRequest(@RequestParam("pg_token") String pgToken) {

        KakaoApproveResponse kakaoApprove = kakaoPayService.approveResponse(pgToken);

        return new ResponseEntity<>(kakaoApprove, HttpStatus.OK);
    }

    /**
     * 결제 진행 중 취소
     */
    @GetMapping("/cancel")
    public void cancel() {

        throw new BusinessLogicException(ExceptionCode.PAY_CANCEL);
    }

    /**
     * 결제 실패
     */
    @GetMapping("/fail")
    public void fail() {

        throw new BusinessLogicException(ExceptionCode.PAY_FAILED);
    }
}
```

### <span style='color: #2D3748; background-color: #ffdce0'>카카오페이 API 결제 환불 구현</span>

![](https://velog.velcdn.com/images/hyoreal51/post/2ce46658-54ea-40b7-bc10-b8cea22abca2/image.png)

- 결제 환불 Request

  - Post 메서드로 https://kapi.kakao.com/v1/payment/cancel 주소로 권한과 Content-Type을 보내라는 의미
  
- 결제 환불 Request Parameter

  - 결제 환불 시 카카오페이 측에서 요청하는 상세 정보
  - https://developers.kakao.com/docs/latest/ko/kakaopay/cancellation#cancellation-request
  
- 결제 환불 Response

  - https://developers.kakao.com/docs/latest/ko/kakaopay/cancellation#cancellation-response
  
- dto 구현

```java
/**
* 결제 취소 요청 시 사용
*/
@Getter
@Setter
@ToString
public class KakaoCancelResponse {

    private String aid; // 요청 고유 번호
    private String tid; // 결제 고유 번호
    private String cid; // 가맹점 코드
    private String status; // 결제 상태
    private String partner_order_id; // 가맹점 주문 번호
    private String partner_user_id; // 가맹점 회원 ID
    private String payment_method_type; // 결제 수단
    private Amount amount; // 결제 금액 정보, 결제 요청 구현할때 이미 구현해놓음
    private ApprovedCancelAmount approved_cancel_amount; // 이번 요청으로 취소된 금액
    private CanceledAmount canceled_amount; // 누계 취소 금액
    private CancelAvailableAmount cancel_available_amount; // 남은 취소 금액
    private String item_name; // 상품 이름
    private String item_code; // 상품 코드
    private int quantity; // 상품 수량
    private String created_at; // 결제 준비 요청 시각
    private String approved_at; // 결제 승인 시각
    private String canceled_at; // 결제 취소 시각
    private String payload; // 취소 요청 시 전달한 값
    
    /**
     * 이번 요청으로 취소된 금액
     */
    @Getter
    @Setter
    @ToString
    public static class ApprovedCancelAmount {

        private int total; // 이번 요청으로 취소된 전체 금액
        private int tax_free; // 이번 요청으로 취소된 비과세 금액
        private int vat; // 이번 요청으로 취소된 부가세 금액
        private int point; // 이번 요청으로 취소된 포인트 금액
        private int discount; // 이번 요청으로 취소된 할인 금액
        private int green_deposit; // 컵 보증금
    }

    /**
     * 누계 취소 금액
     */
    @Getter
    @Setter
    @ToString
    public static class CanceledAmount {

        private int total; // 취소된 전체 누적 금액
        private int tax_free; // 취소된 비과세 누적 금액
        private int vat; // 취소된 부가세 누적 금액
        private int point; // 취소된 포인트 누적 금액
        private int discount; // 취소된 할인 누적 금액
        private int green_deposit; // 컵 보증금
    }

    /**
     * 취소 요청 시 전달한 값
     */
    @Getter
    @Setter
    @ToString
    public static class CancelAvailableAmount {

        private int total; // 전체 취소 가능 금액
        private int tax_free; // 취소 가능 비과세 금액
        private int vat; // 취소 가능 부가세 금액
        private int point; // 취소 가능 포인트 금액
        private int discount; // 취소 가능 할인 금액
        private int green_deposit; // 컵 보증금
    }
}
```

- Service 구현

```java
@Service
@RequiredArgsConstructor
@Transactional
public class KakaoPayService {

    static final String cid = "TC0ONETIME"; // 가맹점 테스트 코드
    static final String admin_Key = "${ADMIN_KEY}"; // 공개 조심! 본인 애플리케이션의 어드민 키를 넣어주세요
    private KakaoReadyResponse kakaoReady;
    
    public KakaoReadyResponse kakaoPayReady() {
    
    ...
    
    }
    
    public KakaoApproveResponse approveResponse(String pgToken) {
    
    ...
    
    }
    
    /**
    * 결제 환불
    */
    public KakaoCancelResponse kakaoCancel() {

        // 카카오페이 요청
        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        parameters.add("cid", cid);
        parameters.add("tid", "환불할 결제 고유 번호");
        parameters.add("cancel_amount", "환불 금액");
        parameters.add("cancel_tax_free_amount", "환불 비과세 금액");
        parameters.add("cancel_vat_amount", "환불 부가세");

        // 파라미터, 헤더
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(parameters, this.getHeaders());
    
        // 외부에 보낼 url
        RestTemplate restTemplate = new RestTemplate();
    
        KakaoCancelResponse cancelResponse = restTemplate.postForObject(
                "https://kapi.kakao.com/v1/payment/cancel",
                requestEntity,
                KakaoCancelResponse.class);
                
        return cancelResponse;
    }
    
    private HttpHeaders getHeaders() {
    
    ...
    
    }
}
```
- Controller 구현

```java
@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class KakaoPayController {

    private final KakaoPayService kakaoPayService;
    
    /**
     * 결제요청
     */
    @PostMapping("/ready")
    public KakaoReadyResponse readyToKakaoPay() {

        return kakaoPayService.kakaoPayReady();
    }
    
    /**
     * 결제 성공
     */
    @GetMapping("/success")
    public ResponseEntity afterPayRequest(@RequestParam("pg_token") String pgToken) {

        KakaoApproveResponse kakaoApprove = kakaoPayService.approveResponse(pgToken);

        return new ResponseEntity<>(kakaoApprove, HttpStatus.OK);
    }

    /**
     * 결제 진행 중 취소
     */
    @GetMapping("/cancel")
    public void cancel() {

        throw new BusinessLogicException(ExceptionCode.PAY_CANCEL);
    }

    /**
     * 결제 실패
     */
    @GetMapping("/fail")
    public void fail() {

        throw new BusinessLogicException(ExceptionCode.PAY_FAILED);
    }
    
    /**
     * 환불
     */
    @PostMapping("/refund")
    public ResponseEntity refund() {

        KakaoCancelResponse kakaoCancelResponse = kakaoPayService.kakaoCancel();

        return new ResponseEntity<>(kakaoCancelResponse, HttpStatus.OK);
    }
}
```

> 참고
> https://developers.kakao.com/docs/latest/ko/kakaopay/common
> https://jungkeung.tistory.com/149
> https://velog.io/@ggujunhee/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8%EC%97%90%EC%84%9C-%EC%B9%B4%EC%B9%B4%EC%98%A4-%ED%8E%98%EC%9D%B4-API-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0