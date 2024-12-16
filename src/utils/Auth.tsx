import { loginAuthStore } from "@/constants/loginAuthStore";

// api 정의서에 맞게 바꾸기
export const login = async (id: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password }),
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    const data = await response.json();
    const { userId, isAdmin, accessToken, refreshToken } = data;
    loginAuthStore.getState().setAuthInfo(
      userId || '',
      isAdmin || false, 
      accessToken,
      refreshToken
    );
    
    return {
      userId,
      isAdmin,
      accessToken,
      refreshToken,
    };
};

// 리프레시 토큰을 이용한 액세스 토큰 갱신
export const refreshAccessToken = async () => {
    const { refreshToken } = loginAuthStore.getState(); 
  
    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다.');
    }

    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      credentials: 'include', // 리프레시 토큰은 쿠키에 저장
    });
  
    if (!response.ok) {
      throw new Error('리프레시 토큰을 통해 액세스 토큰 갱신 실패');
    }
  
    const data = await response.json();
    loginAuthStore.getState().setAuthInfo(
      loginAuthStore.getState().userId || '', 
      loginAuthStore.getState().isAdmin || false, 
      data.accessToken, 
      refreshToken
    );
};

// 인증된 요청 처리 및 토큰 갱신
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let { accessToken } = loginAuthStore.getState();
  
    if (!accessToken) {
      throw new Error('엑세스 토큰이 없습니다.');
    }
  
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  
    // 액세스 토큰이 만료된 경우
    if (response.status === 401) {
      try {
        await refreshAccessToken(); // 리프레시 토큰을 통해 새로운 액세스 토큰 발급
        accessToken = loginAuthStore.getState().accessToken; // 갱신된 액세스 토큰으로 재요청
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        throw new Error('리프레시 토큰으로 액세스 토큰 갱신 실패');
      }
    }
  
    if (!response.ok) {
      throw new Error('요청 실패');
    }
  
    return response.json();
};

// 로그아웃 
export const logout = () => {
    loginAuthStore.getState().clearAuthInfo();
    console.log("로그아웃 되었습니다.");
};