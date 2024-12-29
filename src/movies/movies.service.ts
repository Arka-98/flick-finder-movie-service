import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schemas/movie.schema';
import { Model, Types } from 'mongoose';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
  ) {}

  async createMovie(movie: CreateMovieDto) {
    const createdMovie = new this.movieModel(movie);

    return createdMovie.save();
  }

  async findMovieById(id: Types.ObjectId) {
    return this.movieModel.findById(id);
  }

  async findAllMovies() {
    return this.movieModel.find();
  }

  async findMovieByUserId(userId: string) {
    return this.movieModel.find({});
  }

  async updateMovie(id: Types.ObjectId, movie: CreateMovieDto) {
    return this.movieModel.findByIdAndUpdate(id, { $set: movie });
  }

  async deleteMovie(id: Types.ObjectId) {
    const deletedMovie = await this.movieModel.findByIdAndDelete(id);

    if (!deletedMovie) {
      throw new NotFoundException('Movie not found');
    }

    return deletedMovie;
  }
}
