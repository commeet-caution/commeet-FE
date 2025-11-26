// // src/api/client.ts

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// console.log("✅ API_BASE_URL =", API_BASE_URL);

// if (!API_BASE_URL) {
//   console.warn("⚠️ VITE_API_BASE_URL이 설정되지 않았습니다.");
// }

// type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// interface RequestOptions {
//   method?: HttpMethod;
//   body?: any;
//   headers?: Record<string, string>;
// }

// /**
//  * 세션 쿠키를 자동으로 포함하는 fetch 헬퍼
//  */
// export async function apiFetch<T>(
//   path: string,
//   options: RequestOptions = {}
// ): Promise<T> {
//   const { method = "GET", body, headers = {} } = options;

//   // body 타입에 따라 처리 방식 분기
//   const isFormBody = body instanceof URLSearchParams;
//   const isStringBody = typeof body === "string";

//   const res = await fetch(`${path}`, {
//     method,
//     headers: {
//       // 기본은 JSON
//       "Content-Type": "application/json",
//       // 호출 쪽에서 같은 키를 넘기면 이 값으로 덮어씀
//       ...headers,
//     },
//     credentials: "include", // ★ 세션 쿠키 자동 포함
//     body: body
//       ? isFormBody || isStringBody
//         ? // form-urlencoded 또는 string이면 그대로 전송
//           body.toString()
//         : // 나머지는 JSON 문자열로 전송
//           JSON.stringify(body)
//       : undefined,
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || `Request failed with status ${res.status}`);
//   }

//   // 서버에서 JSON을 준다고 가정
//   return (await res.json()) as T;
// }
