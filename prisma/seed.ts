import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const members = [
  { name: '한지민', age: 29, nation: '한국', parish: '명동본당', cathedral: '명동성당', phone: '010-1234-5001', emergencyNum: '010-8888-5001', chosenDiocese: '서울교구', region: 'seoul' },
  { name: '오승환', age: 44, nation: '한국', parish: '혜화본당', cathedral: '혜화성당', phone: '010-1234-5002', emergencyNum: '010-8888-5002', chosenDiocese: '서울교구', region: 'seoul' },
  { name: '윤아름', age: 31, nation: '한국', parish: '마포본당', cathedral: '마포성당', phone: '010-1234-5003', emergencyNum: '010-8888-5003', chosenDiocese: '서울교구', region: 'seoul' },
  { name: '김태양', age: 38, nation: '한국', parish: '강남본당', cathedral: '강남성당', phone: '010-1234-5004', emergencyNum: '010-8888-5004', chosenDiocese: '서울교구', region: 'seoul' },
  { name: '이다은', age: 26, nation: '한국', parish: '영등포본당', cathedral: '영등포성당', phone: '010-1234-5005', emergencyNum: '010-8888-5005', chosenDiocese: '수원교구', region: 'seoul' },
  { name: '박성민', age: 52, nation: '한국', parish: '수원본당', cathedral: '수원성당', phone: '010-1234-5006', emergencyNum: '010-8888-5006', chosenDiocese: '수원교구', region: 'suwon' },
  { name: '최예린', age: 23, nation: '한국', parish: '분당본당', cathedral: '분당성당', phone: '010-1234-5007', emergencyNum: '010-8888-5007', chosenDiocese: '수원교구', region: 'suwon' },
  { name: '정현우', age: 47, nation: '한국', parish: '용인본당', cathedral: '용인성당', phone: '010-1234-5008', emergencyNum: '010-8888-5008', chosenDiocese: '수원교구', region: 'suwon' },
  { name: '강민서', age: 33, nation: '한국', parish: '안양본당', cathedral: '안양성당', phone: '010-1234-5009', emergencyNum: '010-8888-5009', chosenDiocese: '수원교구', region: 'suwon' },
  { name: '임지수', age: 41, nation: '한국', parish: '평택본당', cathedral: '평택성당', phone: '010-1234-5010', emergencyNum: '010-8888-5010', chosenDiocese: '수원교구', region: 'suwon' },
  { name: '홍준혁', age: 36, nation: '한국', parish: '부산본당', cathedral: '부산성당', phone: '010-1234-5011', emergencyNum: '010-8888-5011', chosenDiocese: '부산교구', region: 'busan' },
  { name: '신유나', age: 28, nation: '한국', parish: '해운대본당', cathedral: '해운대성당', phone: '010-1234-5012', emergencyNum: '010-8888-5012', chosenDiocese: '부산교구', region: 'busan' },
  { name: '배철수', age: 55, nation: '한국', parish: '서면본당', cathedral: '서면성당', phone: '010-1234-5013', emergencyNum: '010-8888-5013', chosenDiocese: '부산교구', region: 'busan' },
  { name: '조하늘', age: 30, nation: '한국', parish: '동래본당', cathedral: '동래성당', phone: '010-1234-5014', emergencyNum: '010-8888-5014', chosenDiocese: '부산교구', region: 'busan' },
  { name: '문서준', age: 22, nation: '한국', parish: '광안본당', cathedral: '광안성당', phone: '010-1234-5015', emergencyNum: '010-8888-5015', chosenDiocese: '부산교구', region: 'busan' },
  { name: '류지혜', age: 39, nation: '한국', parish: '대구본당', cathedral: '대구성당', phone: '010-1234-5016', emergencyNum: '010-8888-5016', chosenDiocese: '대구대교구', region: 'daegu' },
  { name: '안재원', age: 45, nation: '한국', parish: '수성본당', cathedral: '수성성당', phone: '010-1234-5017', emergencyNum: '010-8888-5017', chosenDiocese: '대구대교구', region: 'daegu' },
  { name: '전소희', age: 27, nation: '한국', parish: '달서본당', cathedral: '달서성당', phone: '010-1234-5018', emergencyNum: '010-8888-5018', chosenDiocese: '대구대교구', region: 'daegu' },
  { name: '황민준', age: 50, nation: '한국', parish: '북구본당', cathedral: '북구성당', phone: '010-1234-5019', emergencyNum: '010-8888-5019', chosenDiocese: '대구대교구', region: 'daegu' },
  { name: '서지안', age: 34, nation: '한국', parish: '광주본당', cathedral: '광주성당', phone: '010-1234-5020', emergencyNum: '010-8888-5020', chosenDiocese: '광주대교구', region: 'gwangju' },
  { name: '남궁혜', age: 42, nation: '한국', parish: '서구본당', cathedral: '서구성당', phone: '010-1234-5021', emergencyNum: '010-8888-5021', chosenDiocese: '광주대교구', region: 'gwangju' },
  { name: '송재민', age: 24, nation: '한국', parish: '북구본당', cathedral: '북구성당', phone: '010-1234-5022', emergencyNum: '010-8888-5022', chosenDiocese: '광주대교구', region: 'gwangju' },
  { name: '권나래', age: 37, nation: '한국', parish: '전주본당', cathedral: '전주성당', phone: '010-1234-5023', emergencyNum: '010-8888-5023', chosenDiocese: '전주교구', region: 'jeonju' },
  { name: '노준서', age: 48, nation: '한국', parish: '완산본당', cathedral: '완산성당', phone: '010-1234-5024', emergencyNum: '010-8888-5024', chosenDiocese: '전주교구', region: 'jeonju' },
  { name: '하은지', age: 32, nation: '한국', parish: '인천본당', cathedral: '인천성당', phone: '010-1234-5025', emergencyNum: '010-8888-5025', chosenDiocese: '인천교구', region: 'incheon' },
  { name: '마이클 김', age: 35, nation: '미국', parish: '연수본당', cathedral: '연수성당', phone: '010-1234-5026', emergencyNum: '010-8888-5026', chosenDiocese: '인천교구', region: 'incheon' },
  { name: '다나카 유키', age: 29, nation: '일본', parish: '남동본당', cathedral: '남동성당', phone: '010-1234-5027', emergencyNum: '010-8888-5027', chosenDiocese: '인천교구', region: 'incheon' },
  { name: '왕리', age: 31, nation: '중국', parish: '계양본당', cathedral: '계양성당', phone: '010-1234-5028', emergencyNum: '010-8888-5028', chosenDiocese: '인천교구', region: 'incheon' },
  { name: '이준호', age: 43, nation: '한국', parish: '청주본당', cathedral: '청주성당', phone: '010-1234-5029', emergencyNum: '010-8888-5029', chosenDiocese: '청주교구', region: 'cheongju' },
  { name: '김수현', age: 26, nation: '한국', parish: '흥덕본당', cathedral: '흥덕성당', phone: '010-1234-5030', emergencyNum: '010-8888-5030', chosenDiocese: '청주교구', region: 'cheongju' },
];

const churchgoers = [
  { name: '김성호', baptismalName: '베드로', phone: '010-2000-0001', address: '인천시 중구 답동로', parish: '답동본당', breakfastAvailable: true, lunchAvailable: true, dinnerAvailable: false, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-01 ~ 2026-08-15', availableRooms: 2, maxCapacity: 4, notes: '' },
  { name: '이미영', baptismalName: '마리아', phone: '010-2000-0002', address: '인천시 중구 답동로', parish: '답동본당', breakfastAvailable: true, lunchAvailable: false, dinnerAvailable: true, homestayAvailable: false, mealOnlyAvailable: true, homestayDates: '', availableRooms: 0, maxCapacity: 0, notes: '식사만 제공 가능' },
  { name: '박준혁', baptismalName: '요셉', phone: '010-2000-0003', address: '인천시 중구 답동로', parish: '답동본당', breakfastAvailable: false, lunchAvailable: true, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-05 ~ 2026-08-20', availableRooms: 1, maxCapacity: 2, notes: '' },
  { name: '최수진', baptismalName: '아녜스', phone: '010-2000-0004', address: '인천시 연수구', parish: '연수본당', breakfastAvailable: true, lunchAvailable: true, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-01 ~ 2026-08-31', availableRooms: 3, maxCapacity: 6, notes: '대가족 가능' },
  { name: '정대원', baptismalName: '프란치스코', phone: '010-2000-0005', address: '인천시 연수구', parish: '연수본당', breakfastAvailable: true, lunchAvailable: false, dinnerAvailable: false, homestayAvailable: false, mealOnlyAvailable: true, homestayDates: '', availableRooms: 0, maxCapacity: 0, notes: '아침만 가능' },
  { name: '강은지', baptismalName: '엘리사벳', phone: '010-2000-0006', address: '인천시 남동구', parish: '남동본당', breakfastAvailable: false, lunchAvailable: true, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-10 ~ 2026-08-20', availableRooms: 2, maxCapacity: 3, notes: '' },
  { name: '윤상철', baptismalName: '바오로', phone: '010-2000-0007', address: '인천시 남동구', parish: '남동본당', breakfastAvailable: true, lunchAvailable: true, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-01 ~ 2026-08-25', availableRooms: 2, maxCapacity: 5, notes: '' },
  { name: '한소라', baptismalName: '율리아나', phone: '010-2000-0008', address: '인천시 계양구', parish: '계양본당', breakfastAvailable: true, lunchAvailable: true, dinnerAvailable: false, homestayAvailable: false, mealOnlyAvailable: true, homestayDates: '', availableRooms: 0, maxCapacity: 0, notes: '' },
  { name: '임태준', baptismalName: '토마스', phone: '010-2000-0009', address: '인천시 계양구', parish: '계양본당', breakfastAvailable: false, lunchAvailable: false, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-05 ~ 2026-08-15', availableRooms: 1, maxCapacity: 2, notes: '' },
  { name: '오현주', baptismalName: '데레사', phone: '010-2000-0010', address: '인천시 부평구', parish: '부평본당', breakfastAvailable: true, lunchAvailable: true, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-01 ~ 2026-08-20', availableRooms: 2, maxCapacity: 4, notes: '' },
  { name: '서민재', baptismalName: '안드레아', phone: '010-2000-0011', address: '인천시 부평구', parish: '부평본당', breakfastAvailable: true, lunchAvailable: false, dinnerAvailable: true, homestayAvailable: false, mealOnlyAvailable: true, homestayDates: '', availableRooms: 0, maxCapacity: 0, notes: '' },
  { name: '문예진', baptismalName: '루치아', phone: '010-2000-0012', address: '인천시 서구', parish: '송도본당', breakfastAvailable: false, lunchAvailable: true, dinnerAvailable: false, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-10 ~ 2026-08-25', availableRooms: 1, maxCapacity: 2, notes: '' },
  { name: '황지훈', baptismalName: '야고보', phone: '010-2000-0013', address: '인천시 서구', parish: '송도본당', breakfastAvailable: true, lunchAvailable: true, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-01 ~ 2026-08-31', availableRooms: 3, maxCapacity: 6, notes: '넓은 집' },
  { name: '백수연', baptismalName: '클라라', phone: '010-2000-0014', address: '인천시 미추홀구', parish: '주안본당', breakfastAvailable: true, lunchAvailable: false, dinnerAvailable: false, homestayAvailable: false, mealOnlyAvailable: true, homestayDates: '', availableRooms: 0, maxCapacity: 0, notes: '' },
  { name: '나영수', baptismalName: '루카', phone: '010-2000-0015', address: '인천시 미추홀구', parish: '주안본당', breakfastAvailable: false, lunchAvailable: true, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-05 ~ 2026-08-15', availableRooms: 1, maxCapacity: 3, notes: '' },
  { name: '조민서', baptismalName: '가브리엘', phone: '010-2000-0016', address: '인천시 미추홀구', parish: '간석본당', breakfastAvailable: true, lunchAvailable: true, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-01 ~ 2026-08-20', availableRooms: 2, maxCapacity: 4, notes: '' },
  { name: '유다인', baptismalName: '소피아', phone: '010-2000-0017', address: '인천시 미추홀구', parish: '간석본당', breakfastAvailable: true, lunchAvailable: false, dinnerAvailable: true, homestayAvailable: false, mealOnlyAvailable: true, homestayDates: '', availableRooms: 0, maxCapacity: 0, notes: '' },
  { name: '신동현', baptismalName: '미카엘', phone: '010-2000-0018', address: '인천시 중구', parish: '작전본당', breakfastAvailable: false, lunchAvailable: true, dinnerAvailable: false, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-10 ~ 2026-08-30', availableRooms: 1, maxCapacity: 2, notes: '' },
  { name: '장하은', baptismalName: '안나', phone: '010-2000-0019', address: '인천시 중구', parish: '작전본당', breakfastAvailable: true, lunchAvailable: true, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-01 ~ 2026-08-25', availableRooms: 2, maxCapacity: 5, notes: '' },
  { name: '권혁준', baptismalName: '다니엘', phone: '010-2000-0020', address: '인천시 서구', parish: '청라본당', breakfastAvailable: true, lunchAvailable: true, dinnerAvailable: false, homestayAvailable: false, mealOnlyAvailable: true, homestayDates: '', availableRooms: 0, maxCapacity: 0, notes: '' },
  { name: '이서윤', baptismalName: '베로니카', phone: '010-2000-0021', address: '인천시 서구', parish: '청라본당', breakfastAvailable: false, lunchAvailable: false, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-05 ~ 2026-08-20', availableRooms: 1, maxCapacity: 2, notes: '' },
  { name: '고재민', baptismalName: '스테파노', phone: '010-2000-0022', address: '인천시 서구', parish: '검단본당', breakfastAvailable: true, lunchAvailable: true, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-01 ~ 2026-08-15', availableRooms: 2, maxCapacity: 4, notes: '' },
  { name: '표지연', baptismalName: '로사', phone: '010-2000-0023', address: '인천시 서구', parish: '검단본당', breakfastAvailable: true, lunchAvailable: false, dinnerAvailable: true, homestayAvailable: false, mealOnlyAvailable: true, homestayDates: '', availableRooms: 0, maxCapacity: 0, notes: '' },
  { name: '마동석', baptismalName: '아우구스티노', phone: '010-2000-0024', address: '인천시 동구', parish: '화수본당', breakfastAvailable: false, lunchAvailable: true, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-10 ~ 2026-08-25', availableRooms: 1, maxCapacity: 3, notes: '' },
  { name: '탁지호', baptismalName: '시몬', phone: '010-2000-0025', address: '인천시 동구', parish: '화수본당', breakfastAvailable: true, lunchAvailable: true, dinnerAvailable: true, homestayAvailable: true, mealOnlyAvailable: false, homestayDates: '2026-08-01 ~ 2026-08-31', availableRooms: 3, maxCapacity: 7, notes: '대규모 수용 가능' },
];

async function main() {
  console.log('시딩 시작...');
  for (const m of members) {
    await prisma.member.create({
      data: {
        name: m.name,
        age: BigInt(m.age),
        nation: m.nation,
        parish: m.parish,
        cathedral: m.cathedral,
        phone: m.phone,
        emergencyNum: m.emergencyNum,
        chosenDiocese: m.chosenDiocese,
        region: m.region,
      },
    });
  }
  console.log(`멤버 완료: ${members.length}개 추가됨`);

  for (const c of churchgoers) {
    await prisma.churchgoer.create({
      data: {
        name: c.name,
        baptismalName: c.baptismalName,
        phone: c.phone,
        address: c.address,
        parish: c.parish,
        breakfastAvailable: c.breakfastAvailable,
        lunchAvailable: c.lunchAvailable,
        dinnerAvailable: c.dinnerAvailable,
        homestayAvailable: c.homestayAvailable,
        mealOnlyAvailable: c.mealOnlyAvailable,
        homestayDates: c.homestayDates || null,
        availableRooms: c.availableRooms ? BigInt(c.availableRooms) : null,
        maxCapacity: c.maxCapacity ? BigInt(c.maxCapacity) : null,
        notes: c.notes || null,
      },
    });
  }
  console.log(`본당 인원 완료: ${churchgoers.length}개 추가됨`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
