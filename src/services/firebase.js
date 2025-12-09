/**
 * src/services/firebase.js
 * Initialize Firebase Admin SDK with hardcoded credentials
 */

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'email-sending-api-node-js',
    clientEmail:
      'firebase-adminsdk-fbsvc@email-sending-api-node-js.iam.gserviceaccount.com',
    privateKey: `-----BEGIN PRIVATE KEY-----
 MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC4YLhNDgMKqlQB
 2yiVBvrSmRsUTaXT6HrUJUvfmNG6QfiL+paLUrtjzPp2nFmtqzL3fHnRtWy9wJhj
 FOT3KuJ4iNogJOK/+sb0eBZrRzHllg2XbQcRGhw3GZRn9UknKP9lo/yXaZDMGBLf
 RAWXrzibMovG5HabZ2dzTIBvy5Nt14eX5ewCw2oo9azd6PU6xOy3vD1FOcsLo7UK
 17EBsc7h6aafi0cTQ1KCK3sBV8QBKqMeKKkJQ0cySMl26KrdK5wI74azCc82A2Vt
 L6DN3QCtPzWYV/IuGJu/OBp0xIRCma01QTJU92/w5Zm6bYcGuLqVjnk0YR+88Fxv
 G09ii9ghAgMBAAECggEADtb0Bnml+4YFgGe9/q6i4e/iOtJcEi/wMOJ2lp7DZJEa
 OtP2qWyFeg0drI29dwmkLsClQmBuieA2M6VTH2SjeS2Ulsk5OdfqivMeZNCEXtTi
 r6keDD2Uf0fPBsX6dw0o7yqRcjNULOUUIcWlCJYZAX7COsYZGL1sGV7TKIxTR6AR
 67jAIdwYDCb3HAF2dGgDE7GsPB8QP7i19J7ggOTQnv9l4+XV8GPwpZcP7ksqRd9B
 MxgCL+8FpDZ9PLjYNG0OCzPgnphLA/e6ZyvDiSJhbsA7XzyGhqVy4JHIO7bU2Tbe
 OkRPI7R+5541SY0QUHZQ8azkMvoe2lYv5NeZRP7ORQKBgQDrPq4U1QNU6MNgGyeb
 RQEpBhnnP5PVjjNsVCmNpQVKBNKkXV9jkycLQjf6vwx0sURfZ8cvzj0It5EBm9AD
 4URBz8eY8XgawgWvj2H81TrUqL1/PrDT2Pj4l51+s52xjp4wZyojn/P4Gdn9MLY7
 2W6IFs1aiy1M87rWHpcJBOqFHQKBgQDIpSPNr2VB/5xFdTt2bljJQMhUKd0fhJll
 JmlcVr/iC036XqAJS/euu6n/IanDnrEOfbhrSs/Pfzy9U3dw5JIqigQVYn8+rMNR
 uScW0VBH/ZUuJMG2ynpVGbc6bwSzhLBAe+XAmsAluobUWb+NAsS8WpS301/Tr5gC
 6/4sJz7D1QKBgQCrWSSDmAStPD3TKvRWbJTDxOXpQq3zx3g9V7BMs/5+Q7UKc9if
 Nvghg0IzKiVweg5LT9QORjK+vraobU2/Bb4qEaZZCMlq9BggIFhHSSlo7N/aZ1d1
 d30h1Y2qVDpwsmkW6I4RFNknxey6N1kFjwKrrbA2W1nLy1wzymRI9YO9IQKBgQDB
 9vrsrSFLMwpkDxejvrrwG0NOMYZFIM+VfBOgo3At2lXQssctFZZkAaEuNeHCbVem
 tZyhhBnu8obKU7UEmsI+g1u9PJHcCfFrwHzsTv64CYm8qOXnikfGmuyJfadiz+P/
 AocxsagNEQuknvpRHBsKJtrb9mgN4RMnx/HXxzyi3QKBgQCNxNdHS+V2j/Vi0Gmt
 7i6wvBqy75obK2CXj7pXwxuqyVHPa0MrbhBMEVJfBzJRE0f9j/wN0Kig4Kxcj4a8
 aNCmOrXPi/BRj2u0H/OVqAWvdQ9FnsHFbcSgPF7rblxW2eUHxnItC3ATUsZsnk3J
 pNHvHcG2VPbayVR4rkrJugH2sA==
 -----END PRIVATE KEY-----`,
  }),
  projectId: 'email-sending-api-node-js',
});

const db = admin.firestore();

module.exports = { admin, db };
