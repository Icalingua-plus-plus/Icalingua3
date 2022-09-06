import { useRouter, useRoute } from 'vue-router';

/** useRouter 和 useRoute 常常一起使用，用这个进行简化 */
const useRR = () => {
  const router = useRouter();
  const route = useRoute();
  return { router, route };
};

export default useRR;
