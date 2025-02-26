package com.project.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.model.krhMainVO;
import com.project.service.krhMainService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/main")
public class krhMainController {
	
	private final krhMainService krhmainService;
	
	public krhMainController(krhMainService krhmainService) {
		super();
		this.krhmainService = krhmainService;
	}

	//인기 레시피 조회
	@GetMapping("/popular")
	public List<krhMainVO> popularRecipe() { //리턴타입을 json형태로 변환
		return krhmainService.popularRecipe();
	}
	
	//최신 레시피 조회
	@GetMapping("/recent")
	public List<krhMainVO> recentRecipe(){
		return krhmainService.recentRecipe();
	}
	
	//추후에 httpsession으로 변경
	//관심 목록에 있는 레시피들이 가장 많이 속한 카테고리 속 레시피 추천
	@GetMapping("/recommend")
	public List<krhMainVO> getRecommendedRecipes(HttpSession session){
		//kdhUser loggedInUser = (kdhUser) session.getAttribute("loggedInUser");
	    //System.out.println("사용자 id:"+loggedInUser);
//	    if (loggedInUser == null) {
//	    	loggedInUser = usersService.getDefaultUserId(); // 기본 사용자 ID 설정
//	        session.setAttribute("userId", loggedInUser);
//	    }
	   // System.out.println("사용자 id:"+loggedInUser);
	    // 사용자에 대한 예약 목록을 가져옴
	    //Integer userId = loggedInUser.getId();
	   // if (userId == null) {
	    //    userId = usersService.getDefaultUserId(); // 기본 사용자 ID 설정
	     //   session.setAttribute("userId", userId);
		//return krhmainService.getRecommendedRecipes(id);
		
		//임시 설정
		session.setAttribute("id", "1");
		int id = (int) session.getAttribute("id");
		return krhmainService.getRecommendedRecipes(id);
	}

	//날씨 정보 api
    @GetMapping("/weather")
    public String getWeatherData(@RequestParam String nx, 
                                 @RequestParam String ny) throws Exception {

        // 공공데이터포털에서 받은 인증키(이미 URL 인코딩된 상태라고 가정)
        String serviceKey = "QCLcKUILZZPozckrEjwUCln4vYCn%2Bi48j1XfeMnssk9ZU69BxmCH%2BSseJc5NVWVsixiKMW9eIUbmMFpoYv%2FdVw%3D%3D";
        String today = "20250220"; // 예시: 현재 날짜 또는 API가 제공하는 날짜 값

        // 날씨 API URL 구성
        StringBuilder urlBuilder = new StringBuilder("http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst"); 
        urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8") + "=" + serviceKey);
        urlBuilder.append("&" + URLEncoder.encode("pageNo", "UTF-8") + "=1"); // 페이지 번호
        urlBuilder.append("&" + URLEncoder.encode("numOfRows", "UTF-8") + "=1000"); // 한 페이지 결과 수
        urlBuilder.append("&" + URLEncoder.encode("dataType", "UTF-8") + "=JSON"); // JSON 형식 요청
        urlBuilder.append("&" + URLEncoder.encode("base_date", "UTF-8") + "=" + URLEncoder.encode(today, "UTF-8"));
        urlBuilder.append("&" + URLEncoder.encode("base_time", "UTF-8") + "=0200"); // 02시 발표
        urlBuilder.append("&" + URLEncoder.encode("nx", "UTF-8") + "=" + URLEncoder.encode(nx, "UTF-8")); // X 좌표값
        urlBuilder.append("&" + URLEncoder.encode("ny", "UTF-8") + "=" + URLEncoder.encode(ny, "UTF-8")); // Y 좌표값

        // URL 객체 생성
        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");

        System.out.println("Response code: " + conn.getResponseCode());

        // 응답 읽기
        BufferedReader rd;
        if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        } else {
            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
        }

        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        rd.close();
        conn.disconnect();

        // 응답 결과 출력 (콘솔에서 확인)
        System.out.println("API Response:\n" + sb.toString());

        // 응답 결과를 그대로 리턴 (JSON String)
        return sb.toString();
    }
}