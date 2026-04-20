/* eslint-disable */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
  // 제주교구 참여자
  { name: '강한라', age: 34, nation: '한국', parish: '중앙주교좌본당', cathedral: '제주중앙주교좌성당', phone: '010-1234-5031', emergencyNum: '010-8888-5031', chosenDiocese: '제주교구', region: 'jeju' },
  { name: '고태영', age: 45, nation: '한국', parish: '서귀포본당', cathedral: '서귀포성당', phone: '010-1234-5032', emergencyNum: '010-8888-5032', chosenDiocese: '제주교구', region: 'jeju' },
  { name: '양은별', age: 28, nation: '한국', parish: '신제주본당', cathedral: '신제주성당', phone: '010-1234-5033', emergencyNum: '010-8888-5033', chosenDiocese: '제주교구', region: 'jeju' },
  { name: '부승우', age: 39, nation: '한국', parish: '노형본당', cathedral: '노형성당', phone: '010-1234-5034', emergencyNum: '010-8888-5034', chosenDiocese: '제주교구', region: 'jeju' },
  { name: '오미르', age: 22, nation: '한국', parish: '화북본당', cathedral: '화북성당', phone: '010-1234-5035', emergencyNum: '010-8888-5035', chosenDiocese: '제주교구', region: 'jeju' },
  { name: '현소라', age: 31, nation: '한국', parish: '성산본당', cathedral: '성산성당', phone: '010-1234-5036', emergencyNum: '010-8888-5036', chosenDiocese: '제주교구', region: 'jeju' },
  { name: '이나탈리', age: 27, nation: '필리핀', parish: '중앙주교좌본당', cathedral: '제주중앙주교좌성당', phone: '010-1234-5037', emergencyNum: '010-8888-5037', chosenDiocese: '제주교구', region: 'jeju' },
  { name: '문정훈', age: 52, nation: '한국', parish: '한림본당', cathedral: '한림성당', phone: '010-1234-5038', emergencyNum: '010-8888-5038', chosenDiocese: '제주교구', region: 'jeju' },
];

const churchgoers = [
  // 인천교구 기존 봉사자
  { region: 'incheon', diocese: '인천교구', name: '김성호', baptismalName: '베드로', phone: '010-2000-0001', address: '인천시 중구 답동로', parish: '답동본당', district: '1구역', ban: '2반', familyType: '부부+자녀', childrenCount: 2, housingType: '아파트', breakfastAvailable: true, dinnerAvailable: false, availableRooms: 2, maxCapacity: 4, pilgrimGender: '상관없음', bedroomType: '독립된 방', bedCount: 1, futonCount: 1, bathroomType: '단독', hasWifi: true, hasWasher: true, smokingPolicy: '금연 가정', transportationType: '자가 차량', notes: '' },
  { region: 'incheon', diocese: '인천교구', name: '이미영', baptismalName: '마리아', phone: '010-2000-0002', address: '인천시 중구 답동로', parish: '답동본당', district: '1구역', ban: '3반', familyType: '부부', housingType: '아파트', breakfastAvailable: true, dinnerAvailable: true, availableRooms: 1, maxCapacity: 2, pilgrimGender: '여성', bedroomType: '독립된 방', bedCount: 1, futonCount: 0, bathroomType: '공용', hasWifi: true, hasWasher: true, smokingPolicy: '금연 가정', transportationType: '대중교통 동행', notes: '' },
  { region: 'incheon', diocese: '인천교구', name: '박준혁', baptismalName: '요셉', phone: '010-2000-0003', address: '인천시 중구 답동로', parish: '답동본당', district: '2구역', ban: '1반', familyType: '1인가구(남)', housingType: '빌라/단독', breakfastAvailable: false, dinnerAvailable: true, availableRooms: 1, maxCapacity: 2, pilgrimGender: '남성', bedroomType: '거실 분리 사용', bedCount: 0, futonCount: 2, bathroomType: '공용', hasWifi: true, hasWasher: false, smokingPolicy: '실외 흡연 가능', transportationType: '도보 이동', notes: '' },
  { region: 'incheon', diocese: '인천교구', name: '최수진', baptismalName: '아녜스', phone: '010-2000-0004', address: '인천시 연수구', parish: '연수본당', district: '1구역', ban: '1반', familyType: '부부+자녀', childrenCount: 3, housingType: '아파트', breakfastAvailable: true, dinnerAvailable: true, availableRooms: 3, maxCapacity: 6, pilgrimGender: '상관없음', clergyAcceptable: true, bedroomType: '독립된 방', bedCount: 2, futonCount: 1, bathroomType: '단독', hasWifi: true, hasWasher: true, smokingPolicy: '금연 가정', transportationType: '자가 차량', notes: '대가족 가능' },
  { region: 'incheon', diocese: '인천교구', name: '정대원', baptismalName: '프란치스코', phone: '010-2000-0005', address: '인천시 연수구', parish: '연수본당', district: '2구역', ban: '2반', familyType: '부부', housingType: '아파트', breakfastAvailable: true, dinnerAvailable: false, availableRooms: 1, maxCapacity: 2, pilgrimGender: '남성', bedroomType: '독립된 방', bedCount: 1, futonCount: 0, bathroomType: '단독', hasWifi: true, hasWasher: true, smokingPolicy: '금연 가정', transportationType: '대중교통 동행', notes: '아침만 가능' },
  // 제주교구 봉사자
  { region: 'jeju', diocese: '제주교구', name: '강해녀', baptismalName: '요안나', phone: '010-2000-0101', address: '제주시 중앙로 15', parish: '중앙주교좌본당', district: '1구역', ban: '1반', familyType: '부부+자녀', childrenCount: 2, housingType: '단독주택', breakfastAvailable: true, dinnerAvailable: true, availableRooms: 2, maxCapacity: 4, pilgrimGender: '상관없음', bedroomType: '독립된 방', bedCount: 2, futonCount: 0, bathroomType: '단독', hasWifi: true, hasWasher: true, smokingPolicy: '금연 가정', transportationType: '자가 차량', notes: '한라산 도보 15분' },
  { region: 'jeju', diocese: '제주교구', name: '현동수', baptismalName: '스테파노', phone: '010-2000-0102', address: '제주시 노형동', parish: '노형본당', district: '2구역', ban: '3반', familyType: '부부', housingType: '아파트', breakfastAvailable: true, dinnerAvailable: false, availableRooms: 1, maxCapacity: 2, pilgrimGender: '남성', bedroomType: '독립된 방', bedCount: 1, futonCount: 0, bathroomType: '공용', hasWifi: true, hasWasher: true, smokingPolicy: '금연 가정', transportationType: '대중교통 동행', notes: '아침만 가능' },
  { region: 'jeju', diocese: '제주교구', name: '고순자', baptismalName: '체칠리아', phone: '010-2000-0103', address: '서귀포시 중앙로', parish: '서귀포본당', district: '1구역', ban: '2반', familyType: '부부+자녀', childrenCount: 3, housingType: '단독주택', breakfastAvailable: true, dinnerAvailable: true, availableRooms: 3, maxCapacity: 6, pilgrimGender: '여성', clergyAcceptable: true, bedroomType: '독립된 방', bedCount: 2, futonCount: 2, bathroomType: '단독', hasWifi: true, hasWasher: true, smokingPolicy: '금연 가정', transportationType: '자가 차량', notes: '귤농장 운영, 가족 숙박 가능' },
  { region: 'jeju', diocese: '제주교구', name: '오상철', baptismalName: '바오로', phone: '010-2000-0104', address: '제주시 신제주로', parish: '신제주본당', district: '2구역', ban: '1반', familyType: '1인가구(남)', housingType: '오피스텔', breakfastAvailable: false, dinnerAvailable: false, availableRooms: 1, maxCapacity: 1, pilgrimGender: '남성', bedroomType: '원룸 분리 사용', bedCount: 1, futonCount: 0, bathroomType: '단독', hasWifi: true, hasWasher: false, smokingPolicy: '실외 흡연 가능', transportationType: '도보 이동', notes: '식사 불가' },
  { region: 'jeju', diocese: '제주교구', name: '양미숙', baptismalName: '카타리나', phone: '010-2000-0105', address: '제주시 애월읍', parish: '한림본당', district: '3구역', ban: '1반', familyType: '부부', housingType: '펜션', breakfastAvailable: true, dinnerAvailable: true, availableRooms: 2, maxCapacity: 4, pilgrimGender: '상관없음', bedroomType: '독립된 방', bedCount: 2, futonCount: 1, bathroomType: '단독', hasWifi: true, hasWasher: true, smokingPolicy: '금연 가정', transportationType: '자가 차량', notes: '바다 전망' },
];

const loginAccounts = [
  // 인천 관리자
  { idEmail: 'admin@incheon', password: 'admin1234', role: 'admin', region: 'incheon', nave: null },
  // 인천 본당 매니저
  { idEmail: 'manager.dapdong@incheon', password: 'manager1234', role: 'manager', region: 'incheon', nave: '답동본당' },
  // 제주 관리자
  { idEmail: 'admin@jeju', password: 'admin1234', role: 'admin', region: 'jeju', nave: null },
  // 제주 본당 매니저
  { idEmail: 'manager.jungang@jeju', password: 'manager1234', role: 'manager', region: 'jeju', nave: '중앙주교좌본당' },
  { idEmail: 'manager.seogwipo@jeju', password: 'manager1234', role: 'manager', region: 'jeju', nave: '서귀포본당' },
];

async function main() {
  console.log('시딩 시작...');

  let memberAdded = 0;
  let memberSkipped = 0;
  for (const m of members) {
    const existing = await prisma.member.findFirst({ where: { phone: m.phone } });
    if (existing) { memberSkipped++; continue; }
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
    memberAdded++;
  }
  console.log(`멤버 완료: ${memberAdded}개 추가, ${memberSkipped}개 스킵(이미 존재)`);

  let cgAdded = 0;
  let cgSkipped = 0;
  for (const c of churchgoers) {
    const existing = await prisma.churchgoer.findFirst({ where: { phone: c.phone } });
    if (existing) { cgSkipped++; continue; }
    await prisma.churchgoer.create({
      data: {
        name: c.name,
        baptismalName: c.baptismalName,
        phone: c.phone,
        address: c.address,
        region: c.region,
        diocese: c.diocese,
        parish: c.parish,
        district: c.district,
        ban: c.ban,
        familyType: c.familyType,
        childrenCount: c.childrenCount ? BigInt(c.childrenCount) : null,
        housingType: c.housingType,
        breakfastAvailable: c.breakfastAvailable,
        dinnerAvailable: c.dinnerAvailable,
        availableRooms: c.availableRooms ? BigInt(c.availableRooms) : null,
        maxCapacity: c.maxCapacity ? BigInt(c.maxCapacity) : null,
        pilgrimGender: c.pilgrimGender,
        clergyAcceptable: (c as Record<string, unknown>).clergyAcceptable as boolean | undefined,
        bedroomType: c.bedroomType,
        bedCount: c.bedCount !== undefined ? BigInt(c.bedCount) : null,
        futonCount: c.futonCount !== undefined ? BigInt(c.futonCount) : null,
        bathroomType: c.bathroomType,
        hasWifi: c.hasWifi,
        hasWasher: c.hasWasher,
        smokingPolicy: c.smokingPolicy,
        transportationType: c.transportationType,
        notes: c.notes || null,
      },
    });
    cgAdded++;
  }
  console.log(`본당 인원 완료: ${cgAdded}개 추가, ${cgSkipped}개 스킵(이미 존재)`);

  for (const a of loginAccounts) {
    const existing = await prisma.loginData.findFirst({ where: { idEmail: a.idEmail } });
    if (existing) {
      console.log(`로그인 계정 스킵 (이미 존재): ${a.idEmail}`);
      continue;
    }
    const hashed = await bcrypt.hash(a.password, 10);
    await prisma.loginData.create({
      data: {
        idEmail: a.idEmail,
        password: hashed,
        role: a.role,
        region: a.region,
        nave: a.nave,
      },
    });
    console.log(`로그인 계정 생성: ${a.idEmail} (비밀번호: ${a.password})`);
  }
  console.log(`로그인 계정 완료: ${loginAccounts.length}개 확인됨`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
