import { PrismaClient } from '@prisma/client'
import { buildPrismaQueryOptions } from "prisma-smart-query";

const prisma = new PrismaClient();


export const getAllBooks = async (request, response) => {

    try {
        const { queryOptions, meta } = buildPrismaQueryOptions(
            request,
            {},
            ["title", "author", "publisher", "description"],
            {
                defaultSort: { created_at: "desc" },
            }
        )

        const [books, total] = await Promise.all([
            prisma.book.findMany(queryOptions),
            prisma.book.count({ where: queryOptions.where })
        ])

        response.status(200).json({
            data: books,
            meta: {
                ...meta,
                total,
                totalPages: Math.ceil(total / meta.limit)
            }
        })

    } catch (error)
    {
        console.log(error)
        response.status(500).json({
            message: "Something happening. Bad luck."
        })
    }

}

export const getBook = async (request, response) => {

    try {
        const { id } = request.params

        const book = await prisma.book.findUnique({
            where: { 
                id: Number(id) 
            }
        })

        if (!book) {
            return response.status(404).json({
                message: "Book not found."
            })
        }

        response.status(200).json({
            book
        })

        
    } catch (error) {
        console.log(error)
        response.status(500).json({
            message: "Something happening. Bad luck."
        }) 
    }

}

export const createBook = async (request, response) => {
    const { title, description, year, author, publisher } = request.body;

    try {

        const newBook = await prisma.book.create({
            data: {
                title: title,
                description: description,
                year: year,
                author: author,

                publisher: publisher
            }
        })

        response.status(201).json({
            message: "Book created successfully.",
            newBook
        })        
        
    } catch (error) {
        console.log(error)
        response.status(500).json({
            message: "Something happening. Bad luck."
        })
    }
}

export const updateBook = async (request, response) => {
    const { title, description, year, author, publisher } = request.body;
    const { id } = request.params

    try {
        
        const updatedBook = await prisma.book.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                year,
                author,
                publisher
            }
        })

        response.status(200).json({
            message: "Book updated successfully.",
            updatedBook
        })

    } catch (error) {
        console.log(error)
        response.status(500).json({
            message: "Something happening. Bad luck."
        })
    }
}

export const deleteBook = async (request, response) => {

    try {
        
        const { id } = request.params;

        await prisma.book.delete({
            where: { 
                id: Number(id) 
            }
        })

        response.status(200).json({
            message: "Book deleted successfully.",
        })

    } catch (error) {
        console.log(error)
        response.status(500).json({
            message: "Something happening. Bad luck."
        })
    }

}