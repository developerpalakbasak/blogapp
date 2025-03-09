import { ConnectDB } from "@/lib/config/db"
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";

const LoadDB = async () => {
    await ConnectDB();
}

LoadDB();


// API Endpoint to get emails
export async function GET(req) {


        const emails = await EmailModel.find({});
        const count = emails.length;

        return NextResponse.json({ success: true, count, emails }, { status: 200 })


}


// API Endpoint to add email
export async function POST(req) {
    const formData = await req.formData()
    const email = formData.get('email');
    const emailData = {
        email
    }

    const isExists = await EmailModel.findOne({ email })
    if (isExists) {
        return NextResponse.json({ success: false, msg: "Email Already Subscribed" })
    }

    await EmailModel.create(emailData);
    return NextResponse.json({ success: true, msg: "Email Subscribed" })
}



// API Endpoint to delete email
export async function DELETE(req) {

    const id = await req.nextUrl.searchParams.get("id");
    const email = await EmailModel.findById(id);
   if (email) {

    await EmailModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, msg: "Email Deleted" }, { status: 200 })

   }

   return NextResponse.json({ success: false, msg: "Email Not Found" }, { status: 404 })

}