import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 요청은 실제 백엔드 서버 주소로 전달됨
      '/api': {
        target: 'http://commeet-backend-env.eba-vc3ggwby.ap-northeast-2.elasticbeanstalk.com/', // 실제 백엔드 서버 주소
        changeOrigin: true, // CORS 에러를 피하기 위해 origin을 변경
        // rewrite: (path) => path.replace(/^\/api/, '') // 필요에 따라 경로를 재작성할 수 있음
      }
    }
  }
})