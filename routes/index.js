var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    page: {
      title: 'Trinh Cong Son |  Developer Intern',
      description: 'Portfolio ca nhan cua Trinh Cong Son, tap trung vao backend Node.js, Express.js, MongoDB va xay dung san pham web hoan chinh.'
    },
    profile: {
      name: 'Trinh Cong Son',
      role: ' Developer Intern',
      location: 'Thu Duc, Ho Chi Minh City',
      summary: 'Sinh vien Cong nghe thong tin tap trung vao backend Node.js/Express, quan tam den API thuc te, xac thuc bao mat, co so du lieu va quy trinh CI/CD de dua san pham len moi truong deploy that su.',
      objective: 'Toi dang tim co hoi internship de mo rong ky nang , dac biet la kha nang xay dung backend on dinh, giao tiep giua frontend va API, va tham gia vao nhung san pham giai quyet bai toan thuc te.',
      availability: 'San sang tham gia du an thuc tap backend/ va tiep tuc nang cap san pham ca nhan.',
      initials: 'TS'
    },
    facts: [
      { label: 'Ngay sinh', value: 'January 3, 2004' },
      { label: 'Gioi tinh', value: 'Male' },
      { label: 'Dinh huong', value: 'Backend-first, product mindset' }
    ],
    contacts: [
      { label: 'Phone', value: '', href: 'tel:xxx' },
      { label: 'Email', value: 's', href: 'mailto:xxxx' },
      { label: 'GitHub', value: 'github.com/soncoderz', href: 'xxxx' }
    ],
 
    focusAreas: [
      'Xay dung REST API ro rang, de mo rong va de test.',
      'Trien khai JWT auth, role-based access control va validation cho he thong nguoi dung.',
      'Dong goi va deploy ung dung bang Docker va GitHub Actions.'
    ],
    education: [
      {
        degree: 'Information Technology',
        school: 'HCMC University of Technology',
        period: '2022 - 2026',
        detail: 'GPA: '
      }
    ],
    projects: [
      {
        role: 'Backend Developer',
        title: 'Online appointment scheduling website',
        period: 'March 2025 - December 2025',
        summary: 'Phat trien backend cho nen tang quan ly lich hen va van hanh co ban trong boi canh he thong y te.',
        bullets: [
          'Phat trien API voi Node.js, Express va MongoDB theo huong tach route, schema, controller.',
          'Trien khai JWT authentication va role-based access control cho admin, doctor va patient.',
          'Xay dung cac module appointment scheduling, medical records, prescriptions, billing va notifications.'
        ],
        stack: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Docker']
      }
    ]
  });
});

module.exports = router;
